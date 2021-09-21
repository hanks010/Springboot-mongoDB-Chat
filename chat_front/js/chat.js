let username = prompt('아이디를 입력하세요');
let roomNumber = prompt('채팅방 번호를 입력하세요');

const eventSource = new EventSource(
  `http://localhost:8080/chat/roomNum/${roomNum}`
);

eventSource.onmessage = (event) => {
  console.log(1, event);
  const data = JSON.parse(event.data);
  if (data.sender == username) {
    //로그인한 유저가 보낸 메시지
    //파란박스(오른쪽)
    InitMyMessage(data);
  } else {
    //회색박스(왼쪽)
  }
  InitMessage(data);
};

function getSendMsgBox(msg, time) {
  return `<div class="sent_msg">
  <p>${msg}</p>
  <span class="time_date"> ${time} </span>
</div>`;
}

//최초 초기화될 때 1번방 3건이 있으면 3건을 다 가져온다.
//addMessage() 함수 호출 시 DB에 insert 되고, 그 데이터가 자동으로 흘러들어온다(SSE)
function InitMyMessage(data) {
  let chatBox = document.querySelector('#chat-box'); //채팅 박스 선택

  let chatOutgoingBox = document.createElement('div'); //새로운 div 영역 추가
  chatOutgoingBox.className = 'outgoing_msg'; //클래스명 추가,새로운 div에 디자인 적용됨
  let month = data.createdAt.substring(5, 7);
  let date = data.createdAt.substring(8, 10);
  let hour = data.createdAt.substring(11, 13);
  let minute = data.createdAt.substring(14, 16);
  let time = hour + ':' + minute + ' | ' + month + '/' + date;

  chatOutgoingBox.innerHTML = getSendMsgBox(data.msg, time); //입력창에 들어온 값을 div 영역 안에 추가함
  chatBox.append(chatOutgoingBox); //채팅 박스에 내용 추가
}

async function addMessage() {
  let chatBox = document.querySelector('#chat-box'); //채팅 박스 선택
  let msgInput = document.querySelector('#chat-outgoing-msg'); //입력창 선택

  //alert(msgInput.value);
  let chatOutgoingBox = document.createElement('div'); //새로운 div 영역 추가
  chatOutgoingBox.className = 'outgoing_msg'; //클래스명 추가,새로운 div에 디자인 적용됨

  let date = new Date(); //현재 날짜 및 시간
  let Minute = date.getMinutes();
  if (Minute < 10) {
    Minute = '0' + date.getMinutes();
  }
  let now =
    date.getHours() +
    ':' +
    Minute +
    ' | ' +
    (date.getMonth() + 1) +
    '/' +
    date.getDate();

  let chat = {
    sender: 'ssar',
    receiver: 'cos',
    msg: msgInput.value,
  };

  let response = await fetch('http://localhost:8080/chat', {
    method: 'post', //http post 메서드(새로운 데이터를 write)
    body: JSON.stringify(chat), // JS -> JSON
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  console.log(response);
  let parseResponse = await response.json();

  console.log('parsing', parseResponse);

  chatOutgoingBox.innerHTML = getSendMsgBox(msgInput.value, now); //입력창에 들어온 값을 div 영역 안에 추가함
  chatBox.append(chatOutgoingBox); //채팅 박스에 내용 추가
  msgInput.value = ''; //입력창 비워줌
}

document
  .querySelector('#chat-outgoing-button') //전송 버튼 클릭 리스너 추가
  .addEventListener('click', () => {
    addMessage();
  });

document
  .querySelector('#chat-outgoing-msg')
  .addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
      addMessage();
    }
  });
