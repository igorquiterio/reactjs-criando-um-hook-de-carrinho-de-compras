import { log } from 'console';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const { data: product } = await api.get<Product>(
        `/products/${productId}`
      );

      const { data: stock } = await api.get<Stock>(`/stocks/${productId}`);

      if (stock.amount > 0) {
        const productExists = cart.find((p) => p.id === product.id);
        if (productExists) {
          setCart(
            cart.map((p) =>
              p.id === product.id ? { ...product, amount: p.amount + 1 } : p
            )
          );
        } else {
          setCart([...cart, { ...product, amount: 1 }]);
        }

        await api.put(`/stocks/${productId}`, {
          amount: stock.amount - 1,
        });

        toast.success('Produto adicionado com sucesso!', { autoClose: 3000 });
      } else {
        toast.error('Quantidade solicitada fora de estoque', {
          autoClose: 3000,
        });
      }
    } catch {
      toast.error('Erro na adição do produto', { autoClose: 3000 });
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  useEffect(() => {
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
