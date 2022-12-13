const eventMessage = {
  Type: 'MESSAGE',
  Id: 'M2YcHkgffEvU',
  RequestId: '8fe65e61-1fa2-4563-a90d-c53521e0e63c',
  Attributes: null,
  Content: 'Hi',
  SendTime: '2022-12-02T08:21:20.754555595Z',
  Sender: {
    UserId: 'xxxxxxx.55b2dd6b-7636-414d-ba01-db7abfc7628f',
    Attributes: {
      avatar:
        'https://d39ii5l128t5ul.cloudfront.net/assets/animals_square/dog.png',
      username: 'xxxxxxx',
    },
  },
}

const eventSticker = {
  Type: 'MESSAGE',
  Id: 'uTQ9plbYc91N',
  RequestId: '3865f0c9-8341-4177-891a-a48511b1f360',
  Attributes: {
    message_type: 'STICKER',
    sticker_src:
      'https://d39ii5l128t5ul.cloudfront.net/assets/chat/v1/sticker-8.png',
  },
  Content: 'Sticker: rocket',
  SendTime: '2022-12-02T08:24:33.293316758Z',
  Sender: {
    UserId: 'xxxxxxx.55b2dd6b-7636-414d-ba01-db7abfc7628f',
    Attributes: {
      avatar:
        'https://d39ii5l128t5ul.cloudfront.net/assets/animals_square/dog.png',
      username: 'xxxxxxx',
    },
  },
}

const eventDeleteMessage = {
  Type: 'EVENT',
  Id: 'IxTh2Ad9fZIr',
  RequestId: '',
  EventName: 'aws:DELETE_MESSAGE',
  Attributes: { MessageID: 'M2YcHkgffEvU', Reason: 'Deleted by moderator' },
  SendTime: '2022-12-02T08:25:51.13691272Z',
}

const eventKick = {
  Type: 'EVENT',
  Id: 'Z8Cd2OchZR9K',
  RequestId: '',
  EventName: 'aws:DISCONNECT_USER',
  Attributes: {
    Reason: 'Kicked by moderator',
    UserId: 'aaaaaaa.7235eaff-5ef5-4ebb-8bec-5663e4bac6c3',
  },
  SendTime: '2022-12-02T08:40:48.492927465Z',
}
