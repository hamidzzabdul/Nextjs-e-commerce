import FormSubmitButton from '@/components/formsubmitButton'
import { prisma } from '@/lib/db/prisma'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

export const metadata = {
  title: 'Add Product - ecommerce',
}

async function addProduct(formData: FormData) {
  'use server'

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/add-product')
  }

  const name = formData.get('name')?.toString()
  const description = formData.get('description')?.toString()
  const imageUrl = formData.get('imageUrl')?.toString()
  const price = Number(formData.get('price') || 0)

  if (!name || !description || !imageUrl || !price) {
    throw Error('Missing required fields')
  }

  await prisma.product.create({
    data: { name, description, imageUrl, price },
  })

  redirect('/')
}

export default async function AddProductPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/add-product')
  }
  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Add product</h1>
      <form action={addProduct}>
        <input
          type="text"
          placeholder="enter name"
          name="name"
          className="input input-bordered mb-3 w-full"
          required
        />
        <textarea
          placeholder="description"
          name="description"
          required
          className="textarea textarea-bordered mb-3 w-full"
        />
        <input
          type="url"
          placeholder="upload image"
          name="imageUrl"
          className="input input-bordered mb-3 w-full"
          required
        />
        <input
          type="number"
          placeholder="Price"
          name="price"
          className="input input-bordered mb-3 w-full"
          required
        />
        <FormSubmitButton className="btn-block">Add product</FormSubmitButton>
      </form>
    </div>
  )
}
