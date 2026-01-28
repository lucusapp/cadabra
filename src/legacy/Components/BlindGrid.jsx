import { motion } from 'framer-motion'
import { MoreVertical } from "lucide-react";
import { Link } from 'react-router-dom'

export default function BlindGrid({ groups = [] }) {
  return (
    <div className="p-2 md:p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {groups.flatMap((group, groupIndex) =>
          group.articles.map((article, articleIndex) => {
            const index = groupIndex * 2 + articleIndex

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={article.href}>
                  <div className="relative aspect-square rounded-lg overflow-hidden group">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                    <div className="absolute top-3 left-3 right-3 flex justify-between">
                      <span className="text-white text-xs font-bold uppercase">
                        {group.category}
                      </span>
                      <MoreVertical className="w-5 h-5 text-white/90" />
                    </div>

                    <div className="absolute bottom-0 p-3">
                      <h3 className="text-white text-sm font-semibold line-clamp-3">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
