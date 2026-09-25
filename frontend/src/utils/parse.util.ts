export function parsePriceRange(range: string) {
   if (!range) return {
      minPrice: undefined,
      maxPrice: undefined
   };

   const [ min, max ] = range.split("-").map(Number);

   return {
      minPrice: min ? min * 1000000 : undefined,
      maxPrice: max ? max * 1000000 : undefined
   };
}