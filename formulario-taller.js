// Pega aquí la URL terminada en /exec que obtendrás al publicar el Apps Script.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzIWKzqnjhCHdgBec_fRsKaT_Spkqew5B0hqJY-6pmp3bTkMvP4K9zttNgpHWuOMxY/exec";

const form = document.getElementById("taller-form");
const submitButton = document.getElementById("submit-button");
const statusMessage = document.getElementById("form-status");
const errorSummary = document.getElementById("form-error-summary");
const successPanel = document.getElementById("form-success");
const fluidCanvas = document.getElementById("fluid-background");
const otherCheck = document.getElementById("materiales-otro-check");
const otherInput = document.getElementById("materiales-otro");
const exploreChecks = [...form.querySelectorAll('input[name="explorar"]')];
const exploreCount = document.getElementById("explorar-count");

function updateOtherField() {
  otherInput.disabled = !otherCheck.checked;
  otherInput.required = otherCheck.checked;
  if (!otherCheck.checked) otherInput.value = "";
  if (otherCheck.checked) otherInput.focus();
}

function updateExploreLimit() {
  const selected = exploreChecks.filter(input => input.checked).length;
  exploreCount.textContent = `${selected}/3 seleccionadas`;
  exploreChecks.forEach(input => { input.disabled = selected >= 3 && !input.checked; });
}

function clearErrors() {
  form.querySelectorAll(".question").forEach(question => {
    question.classList.remove("has-error");
    const message = question.querySelector(".field-error");
    if (message) message.textContent = "";
  });
  errorSummary.hidden = true;
}

function showQuestionError(element, message) {
  const question = element.closest(".question");
  if (!question) return;
  question.classList.add("has-error");
  question.querySelector(".field-error").textContent = message;
}

function validateForm() {
  clearErrors();
  let valid = true;

  form.querySelectorAll("input[required], textarea[required]").forEach(field => {
    if (field.type === "radio") return;
    if (!field.value.trim()) {
      showQuestionError(field, "Esta pregunta es obligatoria.");
      valid = false;
    }
  });

  const materials = form.querySelectorAll('input[name="materiales"]:checked');
  if (!materials.length) {
    showQuestionError(form.querySelector('[data-group="materiales"]'), "Selecciona al menos una opción.");
    valid = false;
  } else if (otherCheck.checked && !otherInput.value.trim()) {
    showQuestionError(otherInput, "Especifica cuál es la otra opción.");
    valid = false;
  }

  const selectedExplore = exploreChecks.filter(input => input.checked);
  if (!selectedExplore.length) {
    showQuestionError(form.querySelector('[data-group="explorar"]'), "Selecciona al menos una opción.");
    valid = false;
  } else if (selectedExplore.length > 3) {
    showQuestionError(selectedExplore[0], "Puedes elegir como máximo tres opciones.");
    valid = false;
  }

  const technology = form.querySelector('input[name="relacion_tecnologia"]:checked');
  if (!technology) {
    showQuestionError(form.querySelector('input[name="relacion_tecnologia"]'), "Selecciona una opción.");
    valid = false;
  }

  if (!valid) {
    errorSummary.hidden = false;
    const firstError = form.querySelector(".question.has-error");
    firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
    firstError?.querySelector("input, textarea")?.focus({ preventScroll: true });
  }
  return valid;
}

function collectAnswers() {
  const data = new FormData(form);
  const materials = data.getAll("materiales").filter(value => value !== "Otro");
  if (otherCheck.checked) materials.push(`Otro: ${otherInput.value.trim()}`);
  return {
    practica: data.get("practica").trim(),
    pensando: data.get("pensando").trim(),
    materiales: materials,
    procedimiento: data.get("procedimiento").trim(),
    explorar: data.getAll("explorar"),
    relacion_tecnologia: data.get("relacion_tecnologia"),
    herramientas: data.get("herramientas").trim(),
    referente: data.get("referente").trim(),
    participacion: data.get("participacion").trim(),
    maquina: data.get("maquina").trim(),
    internet: data.get("internet").trim(),
    ritual: data.get("ritual").trim(),
    pagina: window.location.href,
    zona_horaria: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

otherCheck.addEventListener("change", updateOtherField);
exploreChecks.forEach(input => input.addEventListener("change", updateExploreLimit));

form.addEventListener("input", event => {
  const question = event.target.closest(".question");
  if (!question?.classList.contains("has-error")) return;
  question.classList.remove("has-error");
  question.querySelector(".field-error").textContent = "";
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!validateForm()) return;

  if (!GOOGLE_SCRIPT_URL) {
    statusMessage.textContent = "El formulario todavía no está conectado a la hoja de respuestas.";
    return;
  }

  submitButton.disabled = true;
  statusMessage.textContent = "Guardando respuesta…";

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(collectAnswers())
    });
    form.reset();
    updateOtherField();
    updateExploreLimit();
    form.hidden = true;
    successPanel.hidden = false;
    successPanel.focus();
    window.scrollTo({ top: successPanel.offsetTop - 80, behavior: "smooth" });
  } catch (error) {
    statusMessage.textContent = "No fue posible guardar la respuesta. Revisa tu conexión e inténtalo nuevamente.";
    submitButton.disabled = false;
  }
});

updateOtherField();
updateExploreLimit();

function startFluidBackground() {
  if (!fluidCanvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const context = fluidCanvas.getContext("2d");
  const trail = Array.from({ length: 18 }, (_, index) => ({
    x: innerWidth * .5,
    y: innerHeight * .5,
    radius: Math.max(48, 132 - index * 4.2),
    phase: index * .62
  }));
  const pointer = { x: innerWidth * .5, y: innerHeight * .5, active: false, energy: 0 };
  let time = 0;

  function resizeCanvas() {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    fluidCanvas.width = Math.round(innerWidth * ratio);
    fluidCanvas.height = Math.round(innerHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function movePointer(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    pointer.energy = 1;
  }

  function drawBlob(point, index) {
    const wobbleX = Math.sin(time * .018 + point.phase) * (9 + index * .55);
    const wobbleY = Math.cos(time * .014 + point.phase) * (7 + index * .4);
    const x = point.x + wobbleX;
    const y = point.y + wobbleY;
    const radius = point.radius * (.92 + Math.sin(time * .012 + point.phase) * .1);
    const colorShift = (Math.sin(time * .006 + point.phase * .22) + 1) / 2;
    const red = Math.round(88 + (239 - 88) * colorShift);
    const green = Math.round(137 + (120 - 137) * colorShift);
    const blue = Math.round(229 + (185 - 229) * colorShift);
    const alpha = .13 + (1 - index / trail.length) * .09;
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${alpha})`);
    gradient.addColorStop(.56, `rgba(${red}, ${green}, ${blue}, ${alpha * .48})`);
    gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  function animate() {
    time += 1;
    context.clearRect(0, 0, innerWidth, innerHeight);
    pointer.energy += ((pointer.active ? 1 : 0) - pointer.energy) * .055;
    trail[0].x += (pointer.x - trail[0].x) * .16;
    trail[0].y += (pointer.y - trail[0].y) * .16;
    for (let index = 1; index < trail.length; index += 1) {
      trail[index].x += (trail[index - 1].x - trail[index].x) * .13;
      trail[index].y += (trail[index - 1].y - trail[index].y) * .13;
    }
    if (pointer.energy > .01) {
      context.globalAlpha = pointer.energy;
      context.globalCompositeOperation = "source-over";
      trail.forEach(drawBlob);
      context.globalAlpha = 1;
    }
    requestAnimationFrame(animate);
  }

  addEventListener("resize", resizeCanvas);
  addEventListener("pointermove", movePointer, { passive: true });
  addEventListener("pointerleave", () => { pointer.active = false; });
  resizeCanvas();
  animate();
}

startFluidBackground();
