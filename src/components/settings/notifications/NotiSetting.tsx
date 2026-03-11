import GeneralNotiSetting from "./GeneralNotiSetting";
import ActivityNotiSetting from "./ActivityNotiSetting";
import MessgaeNotiSetting from "./MessgaeNotiSetting";

const NotiSetting = () => {
  return (
    <div className="space-y-8">
      <GeneralNotiSetting />
      <ActivityNotiSetting />
      <MessgaeNotiSetting />
    </div>
  );
};

export default NotiSetting;
