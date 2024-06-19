import AddToBag from "@/components/shared/AddToBag";
import CheckoutNow from "@/components/shared/CheckoutNow";

import ImageGallery from "@/components/shared/ImageGallery";
import { Button } from "@/components/shared/Button";
import { Star, Truck } from "lucide-react";

export default function Article1({ content }: any) {
  if (!content) return <></>;
  let { entry = null } = { ...content };
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <ImageGallery images={entry.images} />

          <div className="md:py-8">
            <div className="mb-2 md:mb-3">
              <span className="mb-0.5 inline-block text-gray-500">
                {entry.category.name}
              </span>
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                {entry.name}
              </h2>
            </div>

            <div className="mb-6 flex items-center gap-3 md:mb-10">
              <Button className="rounded-full gap-x-2">
                <span className="text-sm">4.2</span>
                <Star className="h-5 w-5" />
              </Button>

              <span className="text-sm text-gray-500 transition duration-100">
                56 Ratings
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-gray-800 md:text-2xl">
                  ${entry.price}
                </span>
                <span className="mb-0.5 text-red-500 line-through">
                  ${entry.price + 30}
                </span>
              </div>

              <span className="text-sm text-gray-500">
                Incl. Vat plus shipping
              </span>
            </div>

            <div className="mb-6 flex items-center gap-2 text-gray-500">
              <Truck className="w-6 h-6" />
              <span className="text-sm">2-4 Day Shipping</span>
            </div>

            <div className="flex gap-2.5">
              <AddToBag
                currency="USD"
                description={entry.description}
                image={entry.images[0]}
                name={entry.name}
                price={entry.price}
                key={entry._id}
                price_id={entry.price_id}
              />
              <CheckoutNow
                currency="USD"
                description={entry.description}
                image={entry.images[0]}
                name={entry.name}
                price={entry.price}
                key={entry._id}
                price_id={entry.price_id}
              />
            </div>

            <p className="mt-12 text-base text-gray-500 tracking-wide">
              {entry.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
