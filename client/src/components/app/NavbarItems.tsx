import React, { useEffect } from "react"; 
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { useAppSelector } from "@/state/hooks";
import { fetchCategories } from "@/state/category/categorySlice";
import { useAppDispatch } from "@/state/hooks";


 const NavbarItems = () => {
    const {categories} = useAppSelector((state) => state.category);
    const dispatch = useAppDispatch();

    useEffect(() => {
      // Fetch categories if not already loaded
      if (categories.length === 0) {
        dispatch(fetchCategories());
      }
    }, [dispatch, categories.length]);
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger>Hrana za vas</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem href="/docs" title="Introduction">
                Re-usable components built with Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
        <NavigationMenuItem className="flex">
          <NavigationMenuTrigger>Hrana za vas</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {categories.map((category) => (
                <ListItem
                  key={category?.name?.sr}
                  title={category?.name?.sr}
                  id={category?.id}
                   href={`/products/${category?.slug}`}
               
                >
                {category?.description?.sr || "Nema opisa kategorije."}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/docs">O nama</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const  ListItem = ({
  title,
  children,
  href,
  id,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string, id: string }) => {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href} state={{categoryId:id}}  >
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground line-clamp-2">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export default NavbarItems;
