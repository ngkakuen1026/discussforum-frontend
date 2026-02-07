import VisibilitySetting from "./VisibilitySetting";
import DiscoverabilitySetting from "./DiscoverabilitySetting";

const PrivacySetting = () => {
  return (
    <div className="space-y-8">
      <VisibilitySetting />
      <DiscoverabilitySetting />
    </div>
  );
};

export default PrivacySetting;
