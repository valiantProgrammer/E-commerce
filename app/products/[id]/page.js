import ProductDetails from '../../components/products/ProductDetails';

// This is a Server Component that extracts the ID from the URL params
export default async function ProductPage({ params }) {
  const { id } = await params;

  return (
    <main className="bg-gray-50">
      <ProductDetails productId={id} />
    </main>
  );
}
