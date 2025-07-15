import style from "./page.module.css";

export default async function Page() {
  return (
    <div className={style.container}>
      게임1의 페이지입니다.
      <div>
        <button>방만들기</button>
        <button>입장하기</button>
      </div>
    </div>
  );
}
