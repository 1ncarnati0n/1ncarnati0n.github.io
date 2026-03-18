---
title: 1. Intro 강화학습
tags: 
cssclasses: 
aliases:
---


### 강화학습
강화학습<sup>Reinforcement Learning</sup> 의 설명

- 쉽지만 추상적인 설명 
	- *"시행착오를 통해 발전해 나가는 과정"*

- 어렵지만 좀 더 정확한 설명 
	- *"**순차적 의사결정 문제**에서 **누적보상**을 **최대화**하기 위해 **시행착오**를 통해 **행동**을 **교정**하는 학습과정"*

<br>

### 순차적 의사결정 문제
*강화학습이 풀고자 하는 문제* 는 바로 ==순차적 의사 결정==<sup>Sequential decision making</sup> 문제이다.

*예시)*
- 샤워하기
- 주식투자 포트폴리오 관리
- 운전
- 게임

<br>

### 보상
==보상==<sup>Reward</sup>이란 ==의사결정을 얼마나 잘하고 있는지 알려주는 신호==, 그리고 <br>*강화학습의 목적* 은 과정에서 받는 ==보상의 총 합==, 즉 **==누적 보상==** <sup>cumulative reward</sup>을 최대화 하는 것.

**보상의 특징**
1. ==어떻게 x, 얼마나 o== <br>:  보상은 "**어떻게**" 에 대한 정보는 **담지 않는다**. 보상은 단지 내가 **얼마나** 잘하고 있는 지를 **평가** 해줄 뿐.
2.  ==스칼라==<sup>Scalar</sup> <br>:  보상은 **스칼라**인 **하나**의 **크기**를 가진다.
3. ==희소==하고 ==지연==된 보상 <br>:  보상의 세번째 특징은 **희소**<sup>sparse</sup> 할 수 있으며 또 **지연**<sup>delay</sup> 될 수 있다. 

<br>

### 에이전트와 환경
**에이전트**<sup>Agent</sup>가 **액션**<sup>Action(행동)</sup>을 하고 그에 따라 **상황**<sup>state</sup> 이 변하는 것을 하나의 **루프**<sup>loop</sup> 라 했을 때 이 루프가 반복되는 것을 **순차적 의사결정<sup>Sequential decision making</sup> 문제**라 할 수 있다.


1. 현재상황 $s_t$ 에서 어떤행동을 해야 할지 $a_t$ 를 결정
2. 결정된 행동 $a_t$ 를 환경으로 보냄
3. 환경으로부터 그에 따른 보상과 다음 상태의 정보를 받음

<div style="text-align: center;"
><img src ="https://velog.velcdn.com/images/1ncarnati0n/post/28369033-aa56-4fd4-8cd7-1737d9f50b49/image.png" width = "460" /> </div>

1. 에이전트<sup>Agent</sup>로 부터 받은 행동 $a_t$ 를 통해서 상태 변화<sup>state transition</sup>를 일으킴.
2. 그 결과 상태는 $s_t  \longrightarrow s_{t+1}$ 로 바뀜.
3. 에이전트<sup>Agent</sup>에게 줄 보상 $r_{t+1}$ 도 함께 계산.
4. $s_{t+1}$ 과 $r_{t+1}$ 을 에이전트<sup>Agent</sup>에게 전달.

<br>

- $s_t$ 에서 $a_t$ 시행 이를 통해 환경이 $s_{t+1}$ 로 바뀌면, <br>즉 **에이전트**<sup>Agent</sup>와 **환경**<sup>Environment</sup>이 한번 상호작용하면 하나의 루프<sup>loop</sup>가 끝남. <br>이를 ==틱==<sup>tick</sup>이 지났다고 표현한다.


- 실제 세계는 이를 시간의 흐름이 연속적<sup>continuous</sup>으로 보겠지만, <br>순차적 의사결정문제에서는 시간의 흐름을 이산적<sup>discrete</sup>으로 생각한다. <br>이를 ==타임 스텝==<sup>time step</sup>이라 한다.

<br>

### 강화학습의 위력
- 병렬성
- 자가학습 *self-learning* 
