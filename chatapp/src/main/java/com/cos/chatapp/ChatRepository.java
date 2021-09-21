package com.cos.chatapp;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;

import reactor.core.publisher.Flux;

public interface ChatRepository extends ReactiveMongoRepository<Chat, String>{

	@Tailable //커서를 안 닫고 계속 유지한다. -> 조회를 한 번 하고 끝나는 것이 아니라, 
	//조건에 맞는 데이터가 추가로 들어오면 계속해서 Flux로 흘러들어오는 것이다.
	@Query("{sender:?0,receiver:?1}") //sender와 receiver로 조회하는 쿼리문
	Flux<Chat> mFindBySender(String sender, String receiver); //Flux(흐름), 데이터를 계속 흘려서 받겠다는 의미
	// response를 유지하면서 데이터를 계속 흘려보낼 수 있다.
}
