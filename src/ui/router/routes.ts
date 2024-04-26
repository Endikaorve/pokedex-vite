import { Details } from '../views/Details'
import { Favorites } from '../views/Favorites'
import { Home } from '../views/Home'

export const routes = {
  home: {
    path: '/',
    element: Home,
  },
  details: {
    path: '/:id',
    element: Details,
  },
  favorites: {
    path: '/favorites',
    element: Favorites,
  },
}
