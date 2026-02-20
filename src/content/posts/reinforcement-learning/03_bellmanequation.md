---
title: 3. 벨만 방정식
date: 2024-01-01
tags: []
---
## 3.0 벨만 방정식
주어진 정책 $\pi$ 의 상태별 밸류 $v_\pi(s)$를 구하는 것이 생각보다 어려운 일이다. 

*밸류* 를 계산하는 방법은 *"벨만 방정식을 이용해서 구한다."* 나 다름이 없을 정도로 강화학습에서 중요한 수식이다.

이후 다이나믹 프로그래밍<sup>dynamic programming</sup>을 이용하여 벨만 방정식을 반복적으로 사용하여 임의로 초기화 되어 있던 값들이 조금씩 실제 밸류에 가까워지는 방식에 대해 다룰것이다.

<br>

### 재귀 함수
피보나치 수열이 대표적인 예이다.

- 일반적인 함수로 표현
$$
\mathrm{fib}(n) = \frac{1}{\sqrt{5}}\left(\left(\frac{1+\sqrt{5}}{2}\right)^n-\left(\frac{1+\sqrt{5}}{2}\right)^n \right)
$$


- 재귀 함수로 표현
$$
\mathrm{fib}(n) = \mathrm{fib}(n-1) + \mathrm{fib}(n-2)
$$

현재 시점$(T)$ 다음 시점$(T+1$) 사이의 재귀적 관계를 이용해 정의하여 벨만 방정식을 사용한다.

---

<br>

## 3.1 벨만 기대 방정식

> [!quote] 0 단계
>$$
>v_\pi(s_t) = \mathbb{E}_\pi[r_{t+1}+\gamma v_\pi(s_{t+1})]
>$$
>$$
>q_\pi(s_t, a_t) = \mathbb{E}_\pi[r_{t+1}+\gamma q_\pi(s_{t+1},a_{t+1})]
>$$

> [!quote] 1 단계
>$$
>v_\pi(s) = \sum_{a \in A} \pi (a|s)q_\pi(s,a)
>$$
>$$
>q_\pi(s, a) = r^a_s + \gamma \sum_{s' \in S}P^a_{ss'}v_{\pi}(s')
>$$

> [!quote] 2 단계
>$$
>v_\pi(s) = \sum_{a \in A}\pi(a|s) \left(r^a_s + \gamma \sum_{s'\in S} P^a_{ss'}v_\pi(s') \right)
>$$
>$$
>q_\pi(s, a) = r^a_s + \gamma \sum_{s' \in S}P^a_{ss'} \sum_{a' \in A} \pi(a'|s')q_\pi(s', a')
>$$


**0 단계**

$$
v_\pi(s_t) = \mathbb{E}_\pi[r_{t+1}+\gamma v_\pi(s_{t+1})]
$$

- 위 식은 현 상태$s_{t}$ 의 밸류와 다음 상태 $s_{t+1}$의 밸류와의 관계를 나타냄
- $v_\pi$의 정의

> [!quote] 상태 가치 함수 state value function 정의
>$v_\pi(s_t) = \mathbb{E}_\pi[G_t]$ 
>
>$= \mathbb{E}_\pi[r_{t+1}+\gamma r_{t+2}+\gamma^2 r_{t+3}+...]$
>
>$= \mathbb{E}_\pi[r_{t+1}+\gamma(r_{t+2}+\gamma r_{t+3}+...)]$
>
>$=\mathbb{E}_\pi[r_{t+1}+\gamma G_{t+1}]$
>
>$= \mathbb{E}_\pi[r_{t+1}+\gamma v_{\pi}(s_{t+1})]$


$$
\pi(a_1|s_t)=0.6, 
$$
$$
\pi(a_2|s_t)=0.4
$$

<br>

**1 단계**
- **액션 밸류** $q_\pi (s, a)$ 를 이용하여 **상태 밸류** $v_\pi(s)$를 표현 하는 첫 번째 식. 
- $v_\pi(s)$를 이용하여 $q_\pi (s, a)$를 표현하는 두 번째 식. 

> [!quote] 1.액션밸류를 이용하여 상태밸류 계산하기
>$$
>v_\pi(s) = \sum_{a \in A} \pi (a|s)q_\pi(s,a)
>$$
> - $v_\pi(s)$ : s의 밸류
> - $\pi(a|s)$ : s에서 a를 실행할 확률
> - $q_\pi(s,a)$ : s에서 a를 실행하는 것의 밸류 

> [!quote] 2. $v_\pi$(상태밸류)를 이용하여 $q_\pi$(액션밸류)계산하기
>$$
>q_\pi(s, a) = r^a_s + \gamma \sum_{s' \in S}P^a_{ss'}v_{\pi}(s')
>$$
>- $q_\pi(s, a)$ : s에서 a를 실행하는 것의 밸류
>- $r_s^a$ : 즉시 얻는 보상
>- $P^a_{ss'}$ : s에서 a를 실행하면 s'에  도착할 확률
>- $v_\pi(s')$ : s'의 밸류


**2 단계**



## 3.2 벨만 최적 방정식

### 최적 밸류와 최적 정책

$$
v_*(s) = \underset{\pi}{\mathtt{max}} \ v_\pi(s)
$$

$$
q_*(s,a) = \underset{\pi}{\mathtt{max}} \ q_\pi(s, a)
$$

$$
\pi_*
$$

- 최적의 정책 : $\pi_*$
- 최적의 밸류 : $v_*(s)=v_{\pi_*}(s)$   ($\pi_*$를 따랐을 때의 밸류)
- 최적의 액션 밸류 : $q_*(s,a)=q_{\pi_*}(s,a)$   ($\pi_*$를 따랐을 때의 액션 밸류)


$$


$$


### 벨만 최적 방정식

**0단계**
$$
v_*(s_t)=\underset{a}{\mathtt{max}}\mathbb{E}[r_{t+1}+\gamma v_*(s_{t+1})]
$$
$$
q_*(s_t,a_t)=\mathbb{E}[r_{t+1}+\gamma \ \underset{a'}{\mathtt{max}} \ q_*(s_{t+1}, a')]
$$

**1단계**
$$
v_*(s) = \underset{a}{\mathtt{max}} \ q_*(s, a)
$$
$$
q_*(s,a) =  r_s^a+\gamma \sum_{s' \in S}P^a_{ss'}v_*(s')
$$

**2단계**
$$
v_*(s) = \underset{a}{\mathtt{max}} \bigg[ r^a_s+ \gamma \sum_{s'\in S}P^a_{ss'} v_*(s') \bigg]
$$
$$
q_*(s,a)=r_s^a+\gamma \sum_{s'\in S}P_{ss'}^a \underset{a'}{\mathtt{max}}\ q_*)(s',a')
$$

**벨만 '최적' 방정식**에서는 $\pi$<sup>정책 </sup>에 의한 확률적 요소가 사라진다. 최대값 연산자를 통해 제일 좋은 액션을 선택하기에...



