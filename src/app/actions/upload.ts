'use server'

import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

import { createClient } from '@supabase/supabase-js'

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
    
    // Process image with sharp
    const processedBuffer = await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()

    // Initialize Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Upload to Supabase Storage 'catalog' bucket
    const { data, error } = await supabase.storage
      .from('catalog')
      .upload(filename, processedBuffer, {
        contentType: 'image/webp',
        upsert: false
      })

    if (error) {
      console.error('Supabase Storage Error:', error)
      return { error: 'Failed to save image to cloud storage.' }
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('catalog')
      .getPublicUrl(filename)

    return { url: publicUrlData.publicUrl }
  } catch (error: any) {
    console.error('Image upload failed:', error)
    return { error: 'Failed to process and upload image.' }
  }
}
