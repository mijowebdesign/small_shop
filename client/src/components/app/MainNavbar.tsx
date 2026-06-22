import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isUserAdmin, isUserManager} from "@/utils/utils";  

import NavbarItems from "./NavbarItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "@/assets/images.png"; 
import LoginDialog from "./LoginDialog";
import AddProductDialog from "./AddProductDialog";

import { useAuth } from "@/context/AuthContext";

const MainNavbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { user, logout } = useAuth();

  const onLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur h-16">
      <div className="container mx-auto h-full flex items-center justify-between px-4">

       <div className="container mx-auto h-full flex items-center justify-start px-4">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={logo}
            alt="Logo" 
            className="h-8 w-auto object-contain" 
          />
          <span className="font-bold text-xl hidden sm:inline-block">
           Moja Basta
          </span>
        </Link>

        <NavbarItems />
        </div>

        <div className="flex items-center gap-4">
          {(isUserAdmin(user) || isUserManager(user)) && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors outline-none cursor-pointer">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Dodaj</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem onSelect={() => setIsAddProductOpen(true)} className="cursor-pointer">
                  Proizvod
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categories/new" className="cursor-pointer">Kategorija</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/subcategories/new" className="cursor-pointer">Podkategorija</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <LoginDialog 
            open={isLoginOpen} 
            onOpenChange={setIsLoginOpen} 
          />
          <AddProductDialog 
            open={isAddProductOpen} 
            onOpenChange={setIsAddProductOpen} 
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="h-9 w-9 border hover:opacity-80 transition">
                <AvatarImage src={"https://github.com/shadcn.png"} alt={user?.name || undefined} />
                <AvatarFallback className="bg-gray-750 text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              { user ? (
                <>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs font-normal text-gray-500">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin-panel">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/user-panel">User Panel</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Podešavanja</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={onLogout}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    Odjavi se
                  </DropdownMenuItem> 
                </>
              ) : (
                <DropdownMenuItem className="items-center justify-center cursor-pointer"
                  onSelect={() => setIsLoginOpen(true)}
                >
                  Prijavi se
                </DropdownMenuItem>
              )} 
            </DropdownMenuContent> 
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;
