// LubDub Chatbot - Floating Icon and Interactive Chat

const lubdubHTML = `
  <style>
    #lubdub-float-btn {
      position: fixed;
      bottom: 32px; right: 32px;
      z-index: 9999;
      background:rgb(255, 255, 255);
      border-radius: 50%;
      width: 60px; height: 60px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.21);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: box-shadow 0.2s;
    }
    #lubdub-float-btn:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.29);}
    #lubdub-float-btn img { width: 36px; height: 36px;}
    #lubdub-chat-window {
      position: fixed;
      bottom: 100px; right: 32px;
      width: 340px; max-width: 98vw;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.21);
      z-index: 99999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Segoe UI', sans-serif;
    }
    #lubdub-chat-header {
      background: #d32f2f;
      color: #fff;
      font-weight: bold;
      padding: 14px 18px;
      display: flex; justify-content: space-between; align-items: center;
    }
    #lubdub-close { cursor: pointer; font-size: 18px;}
    #lubdub-chat-body {
      padding: 12px 16px;
      height: 320px;
      overflow-y: auto;
      font-size: 15px;
      background: #fcfcfc;
      display: flex; flex-direction: column; gap: 8px;
    }
   #lubdub-chat-input-area {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: #fafafa;
  border-top: 1px solid #eee;
  width: 100%;
  box-sizing: border-box;
}

#lubdub-chat-input {
  border: 1px solid #b0a9a2;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 15px;
  background: #fff;
  color: #222;
  height: 36px;
  width: 100%;
  box-sizing: border-box;
}

.lubdub-btn-row {
  display: flex;
  justify-content: space-between;
  gap: 2px;
}

#lubdub-chat-send,
#lubdub-chat-import {
  flex: 1;
  height: 36px;
  font-size: 13px;
  font-weight: bold;
  border-radius: 8px;
  box-sizing: border-box;
  cursor: pointer;
}

/* Send Button */
#lubdub-chat-send {
  background: #d32f2f;
  color: #fff;
  border: none;
  transition: background 0.2s;
}
#lubdub-chat-send:hover {
  background: #b71c1c;
}

/* Import Button */
#lubdub-chat-import {
  background: #fff;
  color: #d32f2f;
  border: 1px solid #d32f2f;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
#lubdub-chat-import:hover {
  background: #ffeaea;
  color: #b71c1c;
  border-color: #b71c1c;
}

    

    .lubdub-bot-msg, .lubdub-user-msg {
      margin-bottom: 3px;
      max-width: 90%;
      line-height: 1.5;
      border-radius: 10px;
      padding: 8px 12px;
      word-break: break-word;
      display: inline-block;
    }
    .lubdub-bot-msg {
      background: #f3e7db;
      color: #444;
      align-self: flex-start;
    }
    .lubdub-user-msg {
      background: #d32f2f;
      color: #fff;
      align-self: flex-end;
    }
    @media (max-width: 400px) {
      #lubdub-chat-window {
        width: 98vw;
        min-width: 0;
      }
      #lubdub-chat-input-area {
        flex-direction: column;
        gap: 4px;
        padding: 8px 2px;
      }
      #lubdub-chat-input, #lubdub-chat-send, #lubdub-chat-import {
        width: 100%;
        margin: 0 0 0 0;
      }
    }
  </style>
  <div id="lubdub-float-btn" title="Ask LubDub!">
    <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" alt="LubDub Heart"/>
  </div>
  <div id="lubdub-chat-window">
    <div id="lubdub-chat-header">
      <span>LubDub 🫀</span>
      <span id="lubdub-close">&times;</span>
    </div>
    <div id="lubdub-chat-body"></div>
    <div id="lubdub-chat-input-area">
      <input id="lubdub-chat-input" type="text" placeholder="Type your answer..." autocomplete="off"/>
      <div class="lubdub-btn-row">
        <button id="lubdub-chat-send">Send</button>
        <button id="lubdub-chat-import">Import my data</button>
      </div>
    </div>
  </div>
`;

(function () {
  // Inject HTML
  if (!document.getElementById('lubdub-float-btn')) {
    const wrap = document.createElement('div');
    wrap.innerHTML = lubdubHTML;
    document.body.appendChild(wrap);
  }

  // Elements
  const btn = document.getElementById('lubdub-float-btn');
  const chatWin = document.getElementById('lubdub-chat-window');
  const closeBtn = document.getElementById('lubdub-close');
  const chatBody = document.getElementById('lubdub-chat-body');
  const chatInput = document.getElementById('lubdub-chat-input');
  const chatSend = document.getElementById('lubdub-chat-send');
  const chatInputArea = document.getElementById('lubdub-chat-input-area');
  const chatImport = document.getElementById('lubdub-chat-import');

  function showChat() {
    chatWin.style.display = 'flex';
    chatInputArea.style.display = 'flex';
    chatInput.disabled = false;
    chatInput.style.display = 'block';
    chatSend.disabled = false;
    chatInput.focus();
  }

  const questions = [
    { key: 'Cholesterol', msg: 'What is your Cholesterol level? (e.g., high/low/normal)' },
    { key: 'RestingBP', msg: 'What is your Resting Blood Pressure (BP)? (e.g., high/low/normal)' },
    { key: 'FastingBS', msg: 'What is your Fasting Blood Sugar? (e.g., high/normal)' },
    { key: 'MaxHR', msg: 'What is your Maximum Heart Rate (MaxHR)? (e.g., high/low/normal)' },
    { key: 'ExerciseAngina', msg: 'Do you experience chest pain during exercise? (yes/no)' },
    { key: 'BMI', msg: 'What is your BMI? (e.g., obese/underweight/normal)' },
    { key: 'AgeSex', msg: 'What is your age and sex? (e.g., 45 male)' }
  ];
  let userData = {};
  let questionIdx = 0;

  function getSuggestion(data) {
    const table = {
      Cholesterol: {
        high: {
          diet: "🍏 Apples, 🥦 Spinach, 🌾 Oats; avoid fried, processed foods.",
          exercise: "🚶‍♂️ Walk 30–45min, 🧘‍♂️ Yoga: Surya Namaskar, Anulom Vilom 15min"
        },
        low: {
          diet: "Maintain balanced diet.",
          exercise: "Regular activity recommended."
        },
        normal: {
          diet: "Maintain balanced diet.",
          exercise: "Stay active."
        }
      },
      RestingBP: {
        high: {
          diet: "🍌 Bananas, 🥬 Spinach, 🥗 Avocado; limit pickles, salty snacks.",
          exercise: "🚶‍♀️ Walk 20min, 🧘‍♀️ Pranayama 10–15min"
        },
        low: {
          diet: "Slightly salty foods, adequate fluids.",
          exercise: "Gentle activity, yoga."
        },
        normal: {
          diet: "Balanced meals.",
          exercise: "Stay active."
        }
      },
      FastingBS: {
        high: {
          diet: "🍓 Berries, 🥒 Leafy greens, 🌾 Millets; no sweets, sugary drinks.",
          exercise: "🚶‍♀️ Brisk walk 30min, 🏃‍♂️ Aerobic/cycling 3–4x/week"
        },
        normal: {
          diet: "Balanced diet, low sugar.",
          exercise: "Regular activity."
        }
      },
      MaxHR: {
        low: {
          diet: "🥑 Avocado, 🐟 Fish, 🌽 Whole grains, 🥦 Broccoli.",
          exercise: "🏃‍♀️ Gradual endurance: walk→jog→cycle 15–30min"
        },
        high: {
          diet: "Maintain healthy diet.",
          exercise: "Stay active."
        },
        normal: {
          diet: "Balanced meals.",
          exercise: "Regular activity."
        }
      },
      ExerciseAngina: {
        yes: {
          diet: "🍅 Tomato, 🌰 Omega-3 (walnuts, flaxseeds), stay hydrated; avoid red meats.",
          exercise: "🚶‍♂️ Slow walk 15–20min, 🧘 Yin Yoga, Balasana 10min"
        },
        no: {
          diet: "Balanced, anti-inflammatory diet.",
          exercise: "Regular yoga/stretching."
        }
      },
      BMI: {
        obese: {
          diet: "🍎 Watermelon, 🥗 Broccoli, 🥜 Paneer, lentils; limit sweets, fried foods.",
          exercise: "🚶‍♀️ Walk 15–45min, 🏋️ Light resistance training"
        },
        underweight: {
          diet: "Protein-rich, calorie-dense foods.",
          exercise: "Muscle-strengthening exercises."
        },
        normal: {
          diet: "Balanced diet.",
          exercise: "Stay active."
        }
      },
      AgeSex: {
        old: {
          diet: "🥛 Milk, 🥬 Spinach, 🍊 Citrus, ☀️ Sunlight, 🥜 Almonds.",
          exercise: "🏃‍♀️ Tai Chi, walk 20–30min, 🧘‍♀️ Chair Yoga"
        },
        young: {
          diet: "Balanced diet.",
          exercise: "Regular activity."
        }
      }
    };

    let msg = '';
    msg += `<b>Your Personalized Tips:</b><br><ul>`;
    if (data.Cholesterol) {
      let chol = (data.Cholesterol||'').toLowerCase();
      if (table.Cholesterol[chol])
        msg += `<li><b>Cholesterol:</b> ${table.Cholesterol[chol].diet} <br><em>${table.Cholesterol[chol].exercise}</em></li>`;
    }
    if (data.RestingBP) {
      let bp = (data.RestingBP||'').toLowerCase();
      if (table.RestingBP[bp])
        msg += `<li><b>Resting BP:</b> ${table.RestingBP[bp].diet} <br><em>${table.RestingBP[bp].exercise}</em></li>`;
    }
    if (data.FastingBS) {
      let bs = (data.FastingBS||'').toLowerCase();
      if (table.FastingBS[bs])
        msg += `<li><b>Fasting BS:</b> ${table.FastingBS[bs].diet} <br><em>${table.FastingBS[bs].exercise}</em></li>`;
    }
    if (data.MaxHR) {
      let hr = (data.MaxHR||'').toLowerCase();
      if (table.MaxHR[hr])
        msg += `<li><b>Max HR:</b> ${table.MaxHR[hr].diet} <br><em>${table.MaxHR[hr].exercise}</em></li>`;
    }
    if (data.ExerciseAngina) {
      let ea = (data.ExerciseAngina||'').toLowerCase(), ang = (ea==='yes'||ea==='y')?'yes':'no';
      if (table.ExerciseAngina[ang])
        msg += `<li><b>Exercise Angina:</b> ${table.ExerciseAngina[ang].diet} <br><em>${table.ExerciseAngina[ang].exercise}</em></li>`;
    }
    if (data.BMI) {
      let bmi = (data.BMI||'').toLowerCase();
      if (table.BMI[bmi])
        msg += `<li><b>BMI:</b> ${table.BMI[bmi].diet} <br><em>${table.BMI[bmi].exercise}</em></li>`;
    }
    if (data.AgeSex) {
      let age = parseInt((data.AgeSex.match(/\d+/)||[0])[0]);
      let old = (age>=45)?'old':'young';
      if (table.AgeSex[old])
        msg += `<li><b>Age:</b> ${table.AgeSex[old].diet} <br><em>${table.AgeSex[old].exercise}</em></li>`;
    }
    msg += '</ul>';
    msg += `<br>Want a <b>general diet chart</b>? Type <b>'diet chart'</b>.`;
    return msg;
  }

  function getGeneralDiet() {
    return `<b>General Heart-Healthy Diet Chart:</b><br>
    <ul>
      <li>🥗 <b>Breakfast (7:30–9:00 AM):</b> Oats porridge, fruit, 1 boiled egg / sprouts</li>
      <li>🍎 <b>Mid-morning:</b> Fresh fruit or nuts</li>
      <li>🍛 <b>Lunch (12:30–2:00 PM):</b> Brown rice/roti, dal, sabzi, salad, curd</li>
      <li>☕ <b>Evening Snack:</b> Roasted chana, herbal tea, fruit</li>
      <li>🥗 <b>Dinner (7:00–8:30 PM):</b> Soup, mixed veg, paneer/tofu, salad</li>
      <li>💧 <b>Hydration:</b> 2–2.5L water/day</li>
      <li>🚶‍♂️ <b>Exercise:</b> 30–45min walk/yoga daily (Surya Namaskar, Pranayama, Balasana)</li>
      <li>❌ <b>Avoid:</b> Sugary drinks, fried foods, excess salt, processed snacks</li>
    </ul>
    <b>Calories:</b> 1800–2000 kcal (adjust for activity)<br>
    <b>Sleep:</b> Before 10:30 PM, 7–8 hours/night.`;
  }

  function addMsg(msg, who='bot') {
    const el = document.createElement('div');
    el.className = who==='bot' ? 'lubdub-bot-msg' : 'lubdub-user-msg';
    el.innerHTML = msg;
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function askNextQuestion() {
    if (questionIdx < questions.length) {
      addMsg(questions[questionIdx].msg, 'bot');
    } else {
      // If no data imported, show warning
      if (!userData || Object.keys(userData).length === 0) {
        addMsg("<span style='color:#b71c1c;font-weight:bold;'>⚠️ No clinical data available. Please answer the questions or click 'Import my data' after filling the form.</span>", "bot");
      } else {
        setTimeout(() => addMsg(getSuggestion(userData), 'bot'), 700);
      }
    }
  }

  function handleSend() {
    const val = chatInput.value.trim();
    if (!val) return;
    addMsg(val, 'user');
    chatInput.value = '';
    if (/diet\s*chart|general\s*diet/i.test(val)) {
      setTimeout(() => addMsg(getGeneralDiet(), 'bot'), 600);
      return;
    }
    if (questionIdx < questions.length) {
      userData[questions[questionIdx].key] = val;
      questionIdx += 1;
      setTimeout(askNextQuestion, 700);
    }
  }

  // Import clinical form data button logic
  chatImport.onclick = function () {
    const form = document.getElementById('heartForm');
    if (!form) {
      addMsg("Clinical form not found.", "bot");
      return;
    }
    const fd = new FormData(form);

     // List ALL form fields you want to check (these are required for LubDub logic)
  const fields = [
    "Age", "Sex", "RestingBP", "Cholesterol", "FastingBS", "MaxHR", "ExerciseAngina"
  ];

  // Check if ALL fields are empty, null, or invalid
  const allEmpty = fields.every(field => {
    const val = fd.get(field);
    return val === null || val === "" || isNaN(Number(val));
  });

  if (allEmpty) {
    addMsg("<span style='color:#b71c1c;font-weight:bold;'>⚠️ No clinical data available. Please fill out and submit the form first.</span>", "bot");
    userData = {};
    return;
  }

  function num(v) { return Number(v); }

  userData = {}; // reset

    // Cholesterol
    const cholesterol = num(fd.get("Cholesterol"));
    userData["Cholesterol"] = cholesterol >= 240 ? "high" :
                              cholesterol < 200 ? "low" : "normal";

    // RestingBP
    const restingBP = num(fd.get("RestingBP"));
    userData["RestingBP"] = restingBP >= 140 ? "high" :
                            restingBP < 90 ? "low" : "normal";

    // FastingBS
    userData["FastingBS"] = num(fd.get("FastingBS")) === 1 ? "high" : "normal";

    // MaxHR
    const maxHR = num(fd.get("MaxHR"));
    userData["MaxHR"] = maxHR < 100 ? "low" :
                        maxHR > 170 ? "high" : "normal";

    // ExerciseAngina
    userData["ExerciseAngina"] = num(fd.get("ExerciseAngina")) === 1 ? "yes" : "no";

    // BMI -- optional, since height is not present, mark as 'normal'
    userData["BMI"] = "normal";

    // AgeSex
    const age = num(fd.get("Age"));
    const sex = num(fd.get("Sex"));
    userData["AgeSex"] = age + " " + (sex === 1 ? "male" : "female");

    // Check if at least one field is present (not empty or NaN)
    const hasData = Object.values(userData).some(v => v && v !== "normal" && v !== "no" && v !== "young");
    if (!hasData) {
      userData = {};
      addMsg("<span style='color:#b71c1c;font-weight:bold;'>⚠️ No clinical data available. Please fill out and submit the form first.</span>", "bot");
      return;
    }

    addMsg("Imported your clinical form data! Here's your personalized tips:", "bot");
    questionIdx = questions.length; // skip questions
    setTimeout(() => addMsg(getSuggestion(userData), "bot"), 1000);
  };

  btn.onclick = function () {
    showChat();
    if (!chatBody.innerHTML) {
      setTimeout(() => addMsg("Hi! I'm <b>LubDub</b> 🫀. I can suggest exercise and dietary tips for your heart. Let's get started!<br><small>(Type 'diet chart' anytime for a general chart or use the import button below!)</small>", 'bot'), 500);
      setTimeout(askNextQuestion, 1400);
    }
  };
  closeBtn.onclick = function () { chatWin.style.display = 'none'; };
  chatSend.onclick = handleSend;
  chatInput.onkeydown = function (e) { if (e.key === 'Enter') handleSend(); };

  chatWin.addEventListener('transitionend', function() {
    if (chatWin.style.display === 'flex') {
      chatInputArea.style.display = 'flex';
      chatInput.disabled = false;
      chatSend.disabled = false;
      chatInput.style.display = 'block';
      chatInput.focus();
    }
  });
})();