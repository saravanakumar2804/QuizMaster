import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

interface CategoryTabsProps {
  activeCategoryId: number;
}

export default function CategoryTabs({ activeCategoryId }: CategoryTabsProps) {
  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  useEffect(() => {
    // Scroll to the active tab when the component mounts
    const activeTab = document.querySelector('.category-tab.active');
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeCategoryId]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg border-t">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto py-2 scrollbar-hide space-x-4">
          <button 
            className={`category-tab px-4 py-2 ${activeCategoryId === 0 ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} flex-shrink-0 font-medium`}
          >
            All
          </button>
          
          {categories?.map((category: Category) => (
            <button
              key={category.id}
              className={`category-tab px-4 py-2 ${activeCategoryId === category.id ? 'text-primary border-b-2 border-primary active' : 'text-muted-foreground'} flex-shrink-0`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
