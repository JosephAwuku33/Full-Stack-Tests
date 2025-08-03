import React from 'react';
import { Link } from 'react-router';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sprout,
  Leaf,
  Users,
  ShoppingCart,
  ArrowRight,
  Star,
  MapPin,
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts'; // adjust path as needed

const mockFeatured = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    farmer: 'Green Valley Farm',
    price: 4.99,
    rating: 4.9,
    image: '/placeholder.svg',
    location: 'Sacramento, CA',
  },
  {
    id: 2,
    name: 'Farm Fresh Eggs',
    farmer: 'Sunny Side Farm',
    price: 6.5,
    rating: 4.8,
    image: '/placeholder.svg',
    location: 'Davis, CA',
  },
  {
    id: 3,
    name: 'Organic Apples',
    farmer: 'Orchard Hills',
    price: 3.99,
    rating: 4.7,
    image: '/placeholder.svg',
    location: 'Watsonville, CA',
  },
];

const Welcome: React.FC = () => {
  const {
    data: productResponse,
    isLoading,
    isError,
    refetch,
  } = useProducts({ limit: 6, page: 1 });

  // Choose top 3 to show as featured (fallback to mock)
  const featuredProducts =
    productResponse?.data?.slice(0, 3).map((p) => ({
      id: p._id,
      name: p.name,
      farmer: p.farmer?.user?.name || 'Unknown Farm',
      price: p.price,
      rating: 4.5, // placeholder since backend has no rating field yet
      image: p.imageUrl || '/placeholder.svg',
      location: (p.farmer?.location as string) || 'Unknown',
    })) || mockFeatured;

  return (
    <div className="min-h-screen bg-background w-full">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-6">
            <Sprout className="h-16 w-16 text-primary mx-auto mb-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Fresh from Farm to Your Table
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect directly with local farmers and enjoy the freshest produce,
            delivered straight to your door. Support your community while eating
            healthy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shop Fresh Products
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                Join as Farmer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FarmFresh?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-medium transition-all duration-200">
              <CardHeader>
                <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>100% Fresh & Organic</CardTitle>
                <CardDescription>
                  All products are harvested fresh and grown using sustainable,
                  organic practices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-6 hover:shadow-medium transition-all duration-200">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Support Local Farmers</CardTitle>
                <CardDescription>
                  Directly connect with farmers in your area and support your local
                  community
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-6 hover:shadow-medium transition-all duration-200">
              <CardHeader>
                <ShoppingCart className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Convenient Delivery</CardTitle>
                <CardDescription>
                  Fresh produce delivered right to your doorstep at your
                  convenience
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-1">Featured Products</h2>
              <p className="text-muted-foreground">
                Fresh picks from our local farmers
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <Link to="/products">
                <Button variant="outline" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : isError ? (
            <div className="text-center py-12">
              <div className="mb-2 text-red-600">Failed to load products.</div>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">No featured products available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-medium transition-all duration-200 cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        GHS{product.price.toFixed(2)}
                      </span>
                      <Badge variant="outline" className="gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {product.rating}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {product.farmer} {/* location could be injected if available */}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of customers enjoying fresh, local produce delivered
            daily
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Create Account</Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
