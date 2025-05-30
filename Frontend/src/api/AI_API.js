export async function predictDisease(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await fetch('/api/AI/image_detection', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('Upload failed');
    return await response.json();
}