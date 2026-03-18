
<br>

### Optimising Façade of paneling with Machine Learning.

기계학습 알고리즘을 이용한 입면 패널링 최적화

<br>


<p align='center'><img src = "https://velog.velcdn.com/images/1ncarnati0n/post/1afbe05f-cb8c-42ec-9781-c4e881dcb132/image.png" width="720"></p>


자연스러운  곡면  형태에  패널작업을  하기위해선  CP  메쉬 (Circle Packing Mesh: 각 면의 내접원이 패킹을 형성하는 새 로운 삼각형 메쉬)라는 방법을 사용하면 효과적으로  패널링 할 수 있습니다. 본 프로젝트는 이런 삼각형을 6개를 모아서 결 과적으로 육각형의 패널을 형성합니다.


<p align='center'><img src = "https://velog.velcdn.com/images/1ncarnati0n/post/4a3d1244-494d-44ed-9d2c-6bc30c9c4183/image.jpg" width="480"></p>


K-평균 알고리즘은 비지도 학습에서 사용하는 군집화 알고리즘 입니다. 주어진 데이터를 K개의 군집으로 분류하는데 사용하며, 각 군집은 서로 유사한 특성을 가진 데이터들로 구성됩니다. 
본 프로젝트에서는 동일한 패널 갯수를 하이퍼파라미터 K로 지정, 곡면을 구현하는데 적절한 제작 모듈의 갯수를 예산에 따라 조절 할 수가 있습니다.


<p align='center'><img src = "https://velog.velcdn.com/images/1ncarnati0n/post/e4982e3f-b635-4b17-a054-f34c244cdffc/image.png" width="720"></p>


<p align='center'><img src = "https://velog.velcdn.com/images/1ncarnati0n/post/8950c826-b7fc-43b3-96f3-67144ecacfa4/image.png" width="580"></p>
