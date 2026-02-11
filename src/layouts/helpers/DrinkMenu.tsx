import React, { useState, useMemo } from "react";

interface Drink {
  id: number;
  name: string;
  categories: string[];
  price?: number;
  description?: string;
}

interface DrinkMenuProps {
  drinks: Drink[];
}

export default function DrinkMenu({ drinks }: DrinkMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrinks = useMemo(() => {
    const filtered = drinks.filter((drink) => {
      const query = searchQuery.toLowerCase();
      return (
        drink.name.toLowerCase().includes(query) ||
        drink.categories.some((cat) => cat.toLowerCase().includes(query)) ||
        (drink.description && drink.description.toLowerCase().includes(query))
      );
    });
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, drinks]);

  const categories = Array.from(
    new Set(drinks.flatMap((d) => d.categories))
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by drink name, category, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-600">
            Found {filteredDrinks.length} drink{filteredDrinks.length !== 1 ? "s" : ""}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSearchQuery(cat)}
              className={`px-4 py-2 rounded-lg transition ${
                searchQuery === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredDrinks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDrinks.map((drink) => (
            <div
              key={drink.id}
              className="p-5 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-dark">{drink.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {drink.categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 cursor-pointer transition"
                        onClick={() => setSearchQuery(cat)}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                {drink.price && (
                  <span className="text-2xl font-bold text-primary">${drink.price}</span>
                )}
              </div>
              {drink.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {drink.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No drinks found matching "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
