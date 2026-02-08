import VisibilitySetting from "./VisibilitySetting";
import DiscoverabilitySetting from "./DiscoverabilitySetting";
import AdvancedPrivacySetting from "./AdvancedPrivacySetting";

const PrivacySetting = () => {
  return (
    <div className="space-y-8">
      <VisibilitySetting />
      <DiscoverabilitySetting />
      <AdvancedPrivacySetting />
    </div>
  );
};

export default PrivacySetting;
