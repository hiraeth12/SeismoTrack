import { Card, CardContent } from "../../components/ui/card";

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  title,
  description,
}) => {
  return (
    <Card className="w-full max-w-[240px] min-h-[380px] border border-[#d9dbe1] hover:shadow-lg transition-shadow">
      <CardContent className="p-6 flex flex-col items-center h-full">
        <div className="h-32 w-full flex items-center justify-center mb-4">
          <img
            src={image}
            alt={title}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <h3 className="font-bold text-black mb-2 text-center">{title}</h3>
        <div className="w-full max-w-[200px] justify-inter-word flex-grow break-words">
          <p className="text-[#717171] text-sm leading-relaxed text-center">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
