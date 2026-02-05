import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = file.name.split('.').pop();
        const filename = `${file.name.replace(/\.[^/.]+$/, "")}-${uniqueSuffix}.${extension}`;

        // Save to public/uploads
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);

        // Return relative URL
        return NextResponse.json({
            url: `/uploads/${filename}`,
            type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO'
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
