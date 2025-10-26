import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Hero = () => {
  const navigate = useNavigate();

  const carouselImages = Array.from(
    { length: 14 },
    (_, i) => `/photohomepagecaroussel (${i + 1}).jpg`
  );

  return (
    <div className="relative bg-estate-800 py-16 md:py-24 lg:py-32 overflow-hidden">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="absolute inset-0 w-full h-full"
      >
        <CarouselContent className="h-full">
          {carouselImages.map((src, index) => (
            <CarouselItem key={index} className="h-full">
              {/* Ensure the CarouselItem itself and this immediate child div correctly propagate height */}
              <div className="h-full"> 
                <img
                  src={src}
                  alt={`Carousel image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inset-0 bg-black opacity-30"></div> {/* Overlay */}
      </Carousel>

      <div className="container relative z-10">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Trouvez la maison de vos rêves
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Nous vous aidons à trouver la maison de vos rêves. Parcourez notre catalogue de propriétés et trouvez celle qui vous convient le mieux.
          </p>

          {/* Add Listing Button */}
          <div className="max-w-md mx-auto space-y-4">
            <Button
              onClick={() => navigate("/sell")}
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg md:text-xl rounded-lg font-bold w-full"
              size="lg"
            >
              Publier une annonce
            </Button>
            
            {/* View Map Button */}
            <Button
              onClick={() => navigate("/map")}
              className="bg-white hover:bg-gray-50 text-teal-500 border-2 border-teal-500 px-8 py-6 text-lg md:text-xl rounded-lg font-bold w-full"
              size="lg"
            >
              Voir la carte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;