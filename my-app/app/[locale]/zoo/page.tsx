'use client';
import { AdrenalineWorlds } from '@/src/features/portal/components/AdrenalineWorlds';
import { OurHeroesSlider } from '@/src/features/portal/components/OurHeroesSlider';
import { SlideContent } from '@/src/features/portal/components/SlideContent'
import { MOCK_HEROES } from '@/src/features/portal/data/mockHeroes';
import { ZooHero } from '@/src/features/portal/data/mockHeroSlides'
import React from 'react'
import { useGetAttractionsQuery } from '@/src/lib/features/api/apiSlice';

function ZooPage() {
    const { data: animals } = useGetAttractionsQuery({ category: 'animals' });

    return (
        <main className='mt-[106px]'>
            <div className='h-[80dvh]'>
                <SlideContent slide={ZooHero} isActive={true} />
            </div>
            <div >
                <AdrenalineWorlds title="DreamZoo" link='zoo/animals' attractions={animals} />

            </div>
            <OurHeroesSlider mockHeroes={MOCK_HEROES} title="Portal.OurHeroes" />


        </main>
    )
}

export default ZooPage