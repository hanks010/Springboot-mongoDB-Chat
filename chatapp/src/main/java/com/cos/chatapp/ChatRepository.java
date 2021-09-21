package com.cos.chatapp;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;

import reactor.core.publisher.Flux;

public interface ChatRepository extends ReactiveMongoRepository<Chat, String>{

	@Tailable 
	@Query("{sender:?0,receiver:?1}") //sender와 receiver로 조회하는 쿼리문
	Flux<Chat> mFindBySender(String sender, String receiver); //Flux(흐름)
	
	@Tailable
	@Query("{roomNum:?0}") 
	Flux<Chat> mFindByRoomNumber(Integer roomNum);


}
