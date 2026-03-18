### Numpy, Pandas, Scikit-learn

Rhino8을 설치 후 
`C:\Users\내컴퓨터이름\.rhinocode\py39-rh8\Scripts` 폴더를 확인하면 
`pip.exe` 등의 파일들을 확인할 수 있다.

이후 윈도우의 CMD실행, `cd C:\Users\내컴퓨터이름\.rhinocode\py39-rh8\Scripts` 로 해당 디렉토리로 이동,

**numpy**와 **scikit-learn** 최신 버전 등 설치가 순조롭다. 
하지만 **Pandas** 에서 한국어 버전 Windows인 경우 충돌이 있는 듯하다. 
그러므로 pandas 하위 버전에 맞는 버전을 설치함으로 해결하였다

`numpy` 버전은 `1.23.5`
`pandas` 버전은  `1.5.3`
`scikit-learn` 버전은  `1.0.2` 로 설치했다.

*UTF-8* 문제는 pandas 임포트 시
```python
import locale
locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
```
코드로 해결.

간단한 KNN 알고리즘으로 테스트 해볼 수 있다.
```python
import locale
locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')

import numpy as np
import pandas as pd

import sklearn
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

print(f'numpy ver: {np.__version__}')
print(f'pandas ver: {pd.__version__}')
print(f'sklearn ver: {sklearn.__version__}')

# 데이터 로드
iris = datasets.load_iris()
X = iris.data
y = iris.target

# 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 모델 생성 및 학습
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

# 예측
predictions = knn.predict(X_test)

# 정확도 계산
accuracy = accuracy_score(y_test, predictions)
print("정확도:", accuracy)

# 새로운 데이터 예측 테스트
new_data = [[5.1, 3.5, 1.4, 0.2]]  # 한 개의 꽃 데이터
prediction = knn.predict(new_data)
print("예측 결과:", prediction)
print("꽃 이름:", iris.target_names[prediction])
```

```bash
numpy ver: 1.23.5
pandas ver: 1.5.3
sklearn ver: 1.0.2
정확도: 1.0
예측 결과: [0]
꽃 이름: ['setosa']
```
결과값을 grasshopper python scripter로 확인해볼 수 있다.

<br>

---
### Torch & DQN

그래스호퍼<sup>grasshopper</sup>에서 파이토치<sup>PyTorch</sup>를 사용하여 강화학습을 구현할 수 있다. 

1. 필요한 설정:
```python
import torch
import numpy as np
import rhinoscriptsyntax as rs
import ghpythonlib.components as ghc

# CUDA 사용 가능 여부 확인
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
```

2. 간단한 DQN 예제:
```python
# 신경망 모델 정의
class DQN(torch.nn.Module):
    def __init__(self, input_size, output_size):
        super(DQN, self).__init__()
        self.linear1 = torch.nn.Linear(input_size, 64)
        self.linear2 = torch.nn.Linear(64, 32)
        self.linear3 = torch.nn.Linear(32, output_size)

    def forward(self, x):
        x = torch.relu(self.linear1(x))
        x = torch.relu(self.linear2(x))
        return self.linear3(x)

# 환경 상태를 얻는 함수 예시
def get_state():
    # 라이노/그래스호퍼의 지오메트리나 파라미터에서 상태 정보 추출
    return state_vector

# 행동을 수행하는 함수 예시
def take_action(action):
    # 라이노/그래스호퍼에서 실제 행동 수행
    # 예: 지오메트리 변형, 파라미터 조정 등
    return reward
```

<br>

---- 
### 주의사항

1. 필요한 라이브러리 설치:
	- PyTorch
	- NumPy
	- 기타 필요한 패키지들
	
2. 성능 고려사항:
	- 그래스호퍼 내에서 무거운 연산 수행 시 성능 저하 가능
	- 가능하면 학습은 별도 프로세스에서 진행하고 결과만 그래스호퍼에서 활용
	
3. 실제 구현 시 고려할 점:
```python
# 메모리 관리
torch.cuda.empty_cache()  # GPU 메모리 정리

# 에러 처리
try:
    # 강화학습 코드
except Exception as e:
    print(f"에러 발생: {e}")

# 학습 결과 저장
torch.save(model.state_dict(), 'model.pth')
```
이러한 설정으로 그래스호퍼 환경에서 파이토치 기반 강화학습을 구현할 수 있다. 하지만 복잡한 학습의 경우 별도의 Python 환경에서 진행하고 학습된 모델만 그래스호퍼에서 사용하는 것을 권장.


### 고려할 추가 내용

1. 학습 데이터 저장 및 관리:
```python
# CSV 파일로 학습 데이터 저장
import pandas as pd

class DataLogger:
    def __init__(self, file_path):
        self.file_path = file_path
        self.data = []

    def log_episode(self, episode_data):
        self.data.append(episode_data)
        df = pd.DataFrame(self.data)
        df.to_csv(self.file_path, index=False)
```

2. 시각화 도구 연동:
```python
# Tensorboard 연동
from torch.utils.tensorboard import SummaryWriter
writer = SummaryWriter('runs/experiment_1')

# 학습 과정 기록
def log_training(episode, reward, loss):
    writer.add_scalar('Training/Episode Reward', reward, episode)
    writer.add_scalar('Training/Loss', loss, episode)
```

3. 멀티프로세싱 활용:
```python
import multiprocessing as mp

def train_parallel(env_params):
    # 병렬 학습 프로세스
    with mp.Pool(processes=mp.cpu_count()) as pool:
        results = pool.map(train_episode, env_params)
```

4. 환경 설정 최적화:
```python
# 환경 래퍼 클래스
class RhinoEnvironment:
    def __init__(self):
        self.reset_count = 0
        self.max_steps = 1000

    def reset(self):
        # 라이노 지오메트리 초기화
        self.reset_count += 1
        return self._get_state()

    def step(self, action):
        # 행동 수행 및 보상 계산
        next_state = self._get_state()
        reward = self._calculate_reward()
        done = self._check_termination()
        return next_state, reward, done
```

5. 하이퍼파라미터 튜닝:
```python
# Optuna를 사용한 하이퍼파라미터 최적화
import optuna

def objective(trial):
    # 하이퍼파라미터 정의
    lr = trial.suggest_float('lr', 1e-5, 1e-2, log=True)
    batch_size = trial.suggest_int('batch_size', 32, 256)
    # 모델 학습 및 평가
    model = train_model(lr, batch_size)
    return evaluate_model(model)
```

6. 에러 처리 및 복구:
```python
class TrainingManager:
    def __init__(self):
        self.checkpoint_path = "checkpoints/"

    def save_checkpoint(self, model, optimizer, episode):
        torch.save({
            'episode': episode,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
        }, f"{self.checkpoint_path}checkpoint_{episode}.pt")
    
    def load_checkpoint(self, model, optimizer):
        checkpoint = torch.load(f"{self.checkpoint_path}latest.pt")
        model.load_state_dict(checkpoint['model_state_dict'])
        optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        return checkpoint['episode']
```

7. 메모리 관리:
```python
class ReplayBuffer:
    def __init__(self, capacity):
        self.capacity = capacity
        self.buffer = []
        self.position = 0
    
    def push(self, state, action, reward, next_state, done):
        if len(self.buffer) < self.capacity:
            self.buffer.append(None)
        self.buffer[self.position] = (state, action, reward, next_state, done)
        self.position = (self.position + 1) % self.capacity
    
    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        return zip(*batch)
```

8. 성능 모니터링:
```python
import time
class PerformanceMonitor:
    def __init__(self):
        self.start_time = time.time()
        self.episode_times = []
    
    def log_episode_time(self):
        self.episode_times.append(time.time() - self.start_time)
        self.start_time = time.time()
    
    def get_average_time(self):
        return sum(self.episode_times) / len(self.episode_times)
```

이러한 추가 기능들을 구현하면 더 안정적이고 효율적인 강화학습 시스템을 구축할 수 있다. 실제 적용 시에는 프로젝트의 요구사항과 리소스에 맞게 필요한 기능을 선택적으로 구현.