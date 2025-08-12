export default function ProductList({
  data,
  title,
  limit
}: {
  data: any;
  title?: string;
  limit?: number;
}) {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold">{title}</h2>
      {limitedData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {limitedData.map((product: any) => (
            <p key={product.slug}>{product.name}</p>
          ))}
        </div>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
}
