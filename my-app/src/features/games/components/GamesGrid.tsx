import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Game } from '../types';
import { Product } from '../../portal/types';
import Link from 'next/link';

interface GamesGridProps {
  games?: Game[];
  products?: Product[];
  locale: string;
}

export function GamesGrid({ games, products, locale }: GamesGridProps) {
  const t = useTranslations();

  if (games?.length === 0 && products?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-xl text-secondary/60">
          {t('Games.noGamesFound')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games?.map((game) => (
        <Link href={`/${locale}/games/${game.id}`} key={game.id} className="group cursor-pointer">
          <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-surface shadow-xl shadow-black/5 mb-4">
            <Image
              src={game.image}
              alt={game.titleKey}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="px-2">
            <h3 className="text-xl font-bold text-primary mb-2">
              {game.name || (game.titleKey ? t(game.titleKey) : '')}
            </h3>
            <p className="text-sm text-secondary/70 line-clamp-2">
              {game.description || (game.descriptionKey ? t(game.descriptionKey) : '')}
            </p>
          </div>
        </Link>
      ))}
      {products?.map((product) => (
        <div key={product.id} className="group cursor-pointer">
          <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-surface shadow-xl shadow-black/5 mb-4">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="px-2">
            <h3 className="text-xl font-bold text-primary mb-2">
              {product.title}
            </h3>

          </div>
        </div>
      ))}
    </div>
  );
}
