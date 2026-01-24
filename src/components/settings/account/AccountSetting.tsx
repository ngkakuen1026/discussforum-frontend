import AdvancedAccountSetting from "./AdvancedAccountSetting";
import GeneralAccountSetting from "./GeneralAccountSetting";

const AccountSetting = () => {
  return (
    <div className="space-y-8">
      <GeneralAccountSetting />
      <AdvancedAccountSetting />
    </div>
  );
};

export default AccountSetting;
