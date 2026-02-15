
import { useParams } from 'react-router-dom'

const mockArticle = {
  title: 'La IA que cambiará tu trabajo',
  category: 'Tecnología',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
  content: `
La inteligencia artificial ya no es una promesa futura, es una realidad
que está transformando industrias enteras.

Desde el desarrollo de software hasta la medicina, los cambios son
profundos y acelerados. La pregunta ya no es si va a pasar, sino
cómo nos adaptamos.
  `,
}

export default function Article() {
  const { id } = useParams()

  return (
    <article className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[60vh]">
        <img
          src={mockArticle.image}
          alt={mockArticle.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-3xl px-4 pb-12 text-white">
            <span className="text-sm uppercase tracking-wider opacity-80">
              {mockArticle.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mt-2">
              {mockArticle.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {mockArticle.content.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  )
}
