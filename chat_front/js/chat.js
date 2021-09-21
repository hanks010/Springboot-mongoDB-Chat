//로그인 시스템 대신 임시방편
let username = prompt('아이디를 입력하세요');
let roomNum = prompt('채팅방 번호를 입력하세요');

document.querySelector('#username').innerHTML = username;
//SSE 연결하기
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
    InitYourMessage(data);
  }
};

function parsingDate(time) {
  let year = time.substring(2, 4);
  let month = time.substring(5, 7);
  let date = time.substring(8, 10);
  let hour = time.substring(11, 13);
  let minute = time.substring(14, 16);

  return year + '/' + month + '/' + date + ' ' + hour + ':' + minute;
}

//파란 박스 만들기
function getSendMsgBox(data) {
  let time = parsingDate(data.createdAt);
  return `<div class="sent_msg">
  <p>${data.msg}</p>
  <span class="time_date"> ${time} / <b>${data.sender}</b> </span>
</div>`;
}
//회색 박스 만들기
function getReceiveMsgBox(data) {
  let time = parsingDate(data.createdAt);
  return `<div class="received_withd_msg">
  <p>${data.msg}</p>
  <span class="time_date"> ${time} / <b>${data.sender}</b> </span>
</div>`;
}

//최초 초기화될 때 1번방 3건이 있으면 3건을 다 가져온다.
//addMessage() 함수 호출 시 DB에 insert 되고, 그 데이터가 자동으로 흘러들어온다(SSE)

//파란박스 초기화하고 대기
function InitMyMessage(data) {
  let chatBox = document.querySelector('#chat-box'); //채팅 박스 선택

  let sendBox = document.createElement('div'); //새로운 div 영역 추가
  sendBox.className = 'outgoing_msg'; //클래스명 추가,새로운 div에 디자인 적용됨

  parsingDate(data.createdAt);

  sendBox.innerHTML = getSendMsgBox(data); //입력창에 들어온 값을 div 영역 안에 추가함
  chatBox.append(sendBox); //채팅 박스에 내용 추가

  document.sender.scrollTop = document.sender.scrollHeight; //스크롤을 자동으로 내림
}
//회색박스 초기화하고 대기
function InitYourMessage(data) {
  let chatBox = document.querySelector('#chat-box'); //채팅 박스 선택

  let receivedBox = document.createElement('div'); //새로운 div 영역 추가
  receivedBox.className = 'received_msg'; //클래스명 추가,새로운 div에 디자인 적용됨

  parsingDate(data.createdAt);

  receivedBox.innerHTML = getReceiveMsgBox(data); //입력창에 들어온 값을 div 영역 안에 추가함
  chatBox.append(receivedBox); //채팅 박스에 내용 추가
}

//AJAX 채팅 메시지 전송
async function addMessage() {
  let msgInput = document.querySelector('#chat-outgoing-msg'); //입력창 선택

  let chat = {
    sender: username,
    roomNum: roomNum,
    msg: msgInput.value,
  };

  await fetch('http://localhost:8080/chat', {
    method: 'post', //http post 메서드(새로운 데이터를 write)
    body: JSON.stringify(chat), // JS -> JSON
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  msgInput.value = ''; //입력창 비워줌
}

//버튼 클릭 시 메시지 전송
document
  .querySelector('#chat-outgoing-button') //전송 버튼 클릭 리스너 추가
  .addEventListener('click', () => {
    addMessage();
  });
//엔터 클릭 시 메시지 전송
document
  .querySelector('#chat-outgoing-msg')
  .addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
      addMessage();
    }
  });
