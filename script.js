// ========================================
// 設定
// ========================================

// 班の数
const TEAM_COUNT = 7;

// 問題数
const QUESTION_COUNT = 10;

// 順位ごとのポイント
const POINTS = [
    20,
    16,
    12,
    8,
    5,
    2,
    0
];

// 班名
const TEAM_NAMES = [
    "1班",
    "2班",
    "3班",
    "4班",
    "5班",
    "6班",
    "7班"
];


// ========================================
// 問題
// ========================================

const QUESTIONS = [

    "同志社大学の全学生のうち近畿出身の人の割合",

    "2020年のカボス総生産のうち、大分県が占める割合",

    "大分県民のうち月1回以上で唐揚げを食べる人の割合",

    "バイトをする目的が「スキルを身につけたいから」と回答した人の割合",

    "2025年度大学生全体でバイトを一回もしたことがない人の割合",

    "20代男性のうち恋愛相談の相手に恋愛感情を抱くことがある人",

    "既婚者のうち過去の恋愛相手の方がよかったと思ったことがある人",

    "20代・30代の未婚女性のうち男性からのプロポーズに不満を感じた人の割合",

    "中学・高校・大学時代のいずれかで運動部に所属していた人の割合",

    "18～26歳で充実させたいのは仕事よりプライベート"
];


// 正解
//
// ★実際に使用する調査結果に変更してください

const ANSWERS = [

    62,
    99,
    76,
    17,
    9,
    22,
    35,
    72,
    57,
    68

];


// ========================================
// ゲーム変数
// ========================================

// 現在の問題
let currentQuestion = 0;

// 各班の総合得点
let totalPoints =
    new Array(TEAM_COUNT).fill(0);


// ========================================
// 初期化
// ========================================

function initialize() {

    createTeamTable();

    showQuestion();

}


// ========================================
// 班の表を作成
// ========================================

function createTeamTable() {

    const table =
        document.getElementById("teamTable");

    table.innerHTML = "";


    for(let i = 0; i < TEAM_COUNT; i++) {

        const row =
            document.createElement("tr");


        // 班名

        const teamCell =
            document.createElement("td");

        teamCell.textContent =
            TEAM_NAMES[i];


        // 回答入力

        const answerCell =
            document.createElement("td");

        const input =
            document.createElement("input");

        input.type = "number";

        input.min = 0;

        input.max = 100;

        input.className =
            "answer-input";

        input.id =
            "answer-" + i;

        input.placeholder = "%";


        answerCell.appendChild(input);


        // 誤差

        const errorCell =
            document.createElement("td");

        errorCell.id =
            "error-" + i;

        errorCell.textContent = "-";


        // 今回の得点

        const pointCell =
            document.createElement("td");

        pointCell.id =
            "point-" + i;

        pointCell.textContent = "-";


        // 総合得点

        const totalCell =
            document.createElement("td");

        totalCell.id =
            "total-" + i;

        totalCell.textContent =
            "0";


        row.appendChild(teamCell);

        row.appendChild(answerCell);

        row.appendChild(errorCell);

        row.appendChild(pointCell);

        row.appendChild(totalCell);


        table.appendChild(row);
    }

}


// ========================================
// 問題表示
// ========================================

function showQuestion() {

    document.getElementById(
        "questionNumber"
    ).textContent =
        "第" +
        (currentQuestion + 1) +
        "問 / " +
        QUESTION_COUNT +
        "問";


    document.getElementById(
        "question"
    ).textContent =
        QUESTIONS[currentQuestion];


    document.getElementById(
        "correctAnswer"
    ).textContent =
        "正解：未発表";


    for(let i = 0; i < TEAM_COUNT; i++) {

        const input =
            document.getElementById(
                "answer-" + i
            );

        input.value = "";

        input.disabled = false;


        document.getElementById(
            "error-" + i
        ).textContent = "-";


        document.getElementById(
            "point-" + i
        ).textContent = "-";


        document.getElementById(
            "total-" + i
        ).textContent =
            totalPoints[i];
    }


    document.getElementById(
        "resultButton"
    ).disabled = false;


    document.getElementById(
        "nextButton"
    ).disabled = true;


    document.getElementById(
        "message"
    ).textContent =
        "各班の回答を入力してください。";
}


// ========================================
// 正解発表
// ========================================

function showResult() {

    const correct =
        ANSWERS[currentQuestion];


    const predictions =
        new Array(TEAM_COUNT);


    const errors =
        new Array(TEAM_COUNT);


    // --------------------------------
    // 回答取得
    // --------------------------------

    for(let i = 0; i < TEAM_COUNT; i++) {

        const input =
            document.getElementById(
                "answer-" + i
            );


        if(input.value === "") {

            alert(
                TEAM_NAMES[i] +
                "の回答が入力されていません。"
            );

            return;
        }


        const value =
            Number(input.value);


        if(
            value < 0 ||
            value > 100 ||
            !Number.isInteger(value)
        ) {

            alert(
                TEAM_NAMES[i] +
                "の回答は0～100の整数で入力してください。"
            );

            return;
        }


        predictions[i] =
            value;


        errors[i] =
            Math.abs(
                value - correct
            );
    }


    // --------------------------------
    // 正解表示
    // --------------------------------

    document.getElementById(
        "correctAnswer"
    ).textContent =
        "正解：" +
        correct +
        "%";


    // --------------------------------
    // 誤差表示
    // --------------------------------

    for(let i = 0; i < TEAM_COUNT; i++) {

        document.getElementById(
            "error-" + i
        ).textContent =
            errors[i] + "%";


        document.getElementById(
            "answer-" + i
        ).disabled = true;
    }


    // ========================================
    // 誤差の小さい順に並べる
    // ========================================

    const order =
        Array.from(
            { length: TEAM_COUNT },
            (_, i) => i
        );


    order.sort(
        (a, b) =>
            errors[a] - errors[b]
    );


    // ========================================
    // ポイント計算
    // ========================================

    let previousError = -1;

    let previousPoint = 0;


    for(
        let position = 0;
        position < TEAM_COUNT;
        position++
    ) {

        const teamIndex =
            order[position];


        let point;


        // 同率ではない場合

        if(
            position === 0 ||
            errors[teamIndex] !== previousError
        ) {

            if(
                position <
                POINTS.length
            ) {

                point =
                    POINTS[position];

            } else {

                point = 0;
            }


            previousPoint =
                point;

        } else {

            // 同率なら同じポイント

            point =
                previousPoint;
        }


        totalPoints[teamIndex] +=
            point;


        document.getElementById(
            "point-" + teamIndex
        ).textContent =
            "+" + point;


        document.getElementById(
            "total-" + teamIndex
        ).textContent =
            totalPoints[teamIndex];


        previousError =
            errors[teamIndex];
    }


    // ========================================
    // ボタン・メッセージ
    // ========================================

    document.getElementById(
        "resultButton"
    ).disabled = true;


    document.getElementById(
        "message"
    ).textContent =
        "正解発表！誤差の小さい順にポイントが加算されました。";


    const nextButton =
        document.getElementById(
            "nextButton"
        );


    nextButton.disabled = false;


    if(
        currentQuestion ===
        QUESTION_COUNT - 1
    ) {

        nextButton.textContent =
            "最終結果";

    } else {

        nextButton.textContent =
            "次の問題";
    }

}


// ========================================
// 次の問題
// ========================================

function nextQuestion() {

    if(
        currentQuestion ===
        QUESTION_COUNT - 1
    ) {

        showFinalResult();

        return;
    }


    currentQuestion++;


    showQuestion();

}


// ========================================
// 最終結果
// ========================================

function showFinalResult() {

    // --------------------------------
    // 得点順に並べる
    // --------------------------------

    const order =
        Array.from(
            { length: TEAM_COUNT },
            (_, i) => i
        );


    order.sort(
        (a, b) =>
            totalPoints[b] -
            totalPoints[a]
    );


    // --------------------------------
    // HTML作成
    // --------------------------------

    let html = "";


    let rank = 1;


    for(
        let i = 0;
        i < TEAM_COUNT;
        i++
    ) {

        const teamIndex =
            order[i];


        // 同率でなければ順位更新

        if(
            i > 0 &&
            totalPoints[teamIndex] !==
            totalPoints[order[i - 1]]
        ) {

            rank = i + 1;
        }


        html +=
            '<div class="final-rank">' +

            rank +
            "位　" +

            TEAM_NAMES[teamIndex] +

            "　" +

            totalPoints[teamIndex] +

            "点" +

            "</div>";
    }


    document.getElementById(
        "finalResult"
    ).innerHTML =
        html;


    // --------------------------------
    // モーダル表示
    // --------------------------------

    document.getElementById(
        "resultModal"
    ).style.display =
        "flex";


    document.getElementById(
        "message"
    ).textContent =
        "全10問終了！お疲れさまでした！";


    document.getElementById(
        "nextButton"
    ).disabled = true;

}


// ========================================
// 最終結果を閉じる
// ========================================

function closeModal() {

    document.getElementById(
        "resultModal"
    ).style.display =
        "none";
}


// ========================================
// 起動
// ========================================

initialize();