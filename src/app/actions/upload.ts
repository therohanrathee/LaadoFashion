'use server'

import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('imageFile') as File | null
    if (!file) {
      return { error: 'No file provided' }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Generate unique filename
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filename = `upload-${uniqueId}.webp`
    
    // Ensure the uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public/images/catalog/uploads')
    try {
      await fs.access(uploadsDir)
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true })
    }

    // Compress and convert to webp using sharp
    await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true }) // Resize to max 800px width
      .webp({ quality: 80 }) // Compress
      .toFile(path.join(uploadsDir, filename))

    return { url: `/images/catalog/uploads/${filename}` }
  } catch (error: any) {
    console.error('Image upload failed:', error)
    return { error: 'Failed to process and upload image.' }
  }
}
