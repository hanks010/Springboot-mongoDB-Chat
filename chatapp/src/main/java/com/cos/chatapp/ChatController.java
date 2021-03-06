package com.cos.chatapp;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RestController
public class ChatController {

	@Autowired
	private ChatRepository chatRepository;
	
	//귓속말 할 때 사용
	//데이터를 받아오는 컨트롤러
	@CrossOrigin
	@GetMapping(value ="/sender/{sender}/receiver/{receiver}",produces=MediaType.TEXT_EVENT_STREAM_VALUE)//SSE 프로토콜을 의미
	public Flux<Chat> getMsg(@PathVariable String sender,@PathVariable  String receiver) {
		return chatRepository.mFindBySender(sender, receiver)
		.subscribeOn(Schedulers.boundedElastic());
	}
	//데이터를 입력하는 컨트롤러
	@CrossOrigin
	@PostMapping("/chat")
	public Mono<Chat> setMsg(@RequestBody Chat chat){	//Mono는 데이터를 한 번만 리턴한다는 의미, 리턴타입을 void로 설정해도 된다.
		chat.setCreatedAt(LocalDateTime.now());
		return chatRepository.save(chat);//Object를 리턴하면 JSON 변환(MessageConverter)
	}
	
	@CrossOrigin
	@GetMapping(value ="/chat/roomNum/{roomNum}",produces=MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<Chat> findByRoomNumber(@PathVariable Integer roomNum){
		return chatRepository.mFindByRoomNumber(roomNum)
				.subscribeOn(Schedulers.boundedElastic());
	}
	
	
}
