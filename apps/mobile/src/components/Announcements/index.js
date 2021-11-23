import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useTracked} from '../../provider';
import {useMessageStore} from '../../provider/stores';
import {eSubscribeEvent, eUnSubscribeEvent} from '../../services/EventManager';
import {
  eCloseAnnouncementDialog,
  eOpenAnnouncementDialog
} from '../../utils/Events';
import BaseDialog from '../Dialog/base-dialog';
import {renderItem} from "./functions";

export const AnnouncementDialog = () => {
  const [state] = useTracked();
  const colors = state.colors;
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState(null);
  const remove = useMessageStore(state => state.remove);

  useEffect(() => {
    eSubscribeEvent(eOpenAnnouncementDialog, open);
    eSubscribeEvent(eCloseAnnouncementDialog, close);
    return () => {
      eUnSubscribeEvent(eOpenAnnouncementDialog, open);
      eUnSubscribeEvent(eCloseAnnouncementDialog, close);
    };
  }, [visible]);

  const open = data => {
    setInfo(data);
    console.log(info);
    setVisible(true);
  };

  const close = () => {
    remove(info.id);
    setInfo(null);
    setVisible(false);
  };

  return (
    <BaseDialog
      animated={false}
      centered={false}
      bottom={true}
      onRequestClose={close}
      visible={visible}>
      <View
        style={{
          width: '100%',
          backgroundColor: colors.bg,
          maxHeight: '100%'
        }}>
        <FlatList
          style={{
            width: '100%'
          }}
          data={info?.body}
          renderItem={renderItem}
        />

        <View
          style={{
            height: 15
          }}
        />
      </View>
    </BaseDialog>
  );
};
