import { useEffect, useState } from 'react'

export function useHomeData() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [articles, setArticles] = useState([])
  const [books, setBooks] = useState([])

  useEffect(() => {
    // simulamos llamada async
    setTimeout(() => {
      setCategories([
        { id: 1, name: 'Lectura', slug: 'lectura' },
        { id: 2, name: 'Negocio', slug: 'negocio' },
      ])

      setArticles([
        {
          id: 1,
          title: 'Cómo crear hábitos de lectura',
          category_id: 1,
          cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
        },
        {
          id: 2,
          title: 'Mentalidad emprendedora en 2024',
          category_id: 2,
          cover_image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600',
        },
      ])

      setBooks([
        {
          id: 1,
          title: 'Atomic Habits',
          cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
        },
      ])

      setLoading(false)
    }, 600)
  }, [])

  return { loading, categories, articles, books }
}

