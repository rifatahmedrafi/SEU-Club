document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("membershipForm");
  const successPanel = document.getElementById("successPanel");
  const summaryBody = document.getElementById("summaryBody");
  const editAgainBtn = document.getElementById("editAgainBtn");


  function el(id) {
    return document.getElementById(id);
  }

  function markInvalid(wrapId) {
    document.getElementById(wrapId).classList.add("show-error");
    document.getElementById(wrapId).classList.remove("field-ok");
  }

  function markValid(wrapId) {
    document.getElementById(wrapId).classList.remove("show-error");
    document.getElementById(wrapId).classList.add("field-ok");
  }

 
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^01[0-9]{9}$/;
  const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  function validateFullName() {
    const v = el("fullName").value.trim();
    const ok = v.length >= 3;
    ok ? markValid("wrap-fullName") : markInvalid("wrap-fullName");
    return ok;
  }

  function validateEmail() {
    const v = el("email").value.trim();
    const ok = EMAIL_RE.test(v);
    ok ? markValid("wrap-email") : markInvalid("wrap-email");
    return ok;
  }

  function validatePhone() {
    const v = el("phone").value.trim();
    const ok = PHONE_RE.test(v);
    ok ? markValid("wrap-phone") : markInvalid("wrap-phone");
    return ok;
  }

  function validatePassword() {
    const v = el("password").value;
    const ok = PASSWORD_RE.test(v);
    ok ? markValid("wrap-password") : markInvalid("wrap-password");
    if (el("confirmPassword").value) validateConfirmPassword();
    return ok;
  }

    function validateConfirmPassword() {
    const ok =
      el("confirmPassword").value.length > 0 &&
      el("confirmPassword").value === el("password").value;
    ok ? markValid("wrap-confirmPassword") : markInvalid("wrap-confirmPassword");
    return ok;
  }

  function validateDob() {
    const v = el("dob").value;
    if (!v) {
      markInvalid("wrap-dob");
      return false;
    }
    const dob = new Date(v);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    const ok = age >= 16;
    ok ? markValid("wrap-dob") : markInvalid("wrap-dob");
    return ok;
  }

  function validateClub() {
    const ok = el("club").value !== "";
    ok ? markValid("wrap-club") : markInvalid("wrap-club");
    return ok;
  }

  function validateMembershipType() {
    const ok = document.querySelector('input[name="membershipType"]:checked') !== null;
    ok ? markValid("wrap-membershipType") : markInvalid("wrap-membershipType");
    return ok;
  }

  function validateInterests() {
    const ok = document.querySelectorAll('input[name="interests"]:checked').length > 0;
    ok ? markValid("wrap-interests") : markInvalid("wrap-interests");
    return ok;
  }

  function validateBio() {
    const v = el("bio").value.trim();
    const ok = v.length >= 10;
    ok ? markValid("wrap-bio") : markInvalid("wrap-bio");
    return ok;
  }

  function validatePhoto() {
    const files = el("photo").files;
    if (!files || files.length === 0) {
      markValid("wrap-photo");
      return true;
    }
    const ok = files[0].type === "image/jpeg" || files[0].type === "image/png";
    ok ? markValid("wrap-photo") : markInvalid("wrap-photo");
    return ok;
  }

 
  el("fullName").addEventListener("blur", validateFullName);
  el("email").addEventListener("blur", validateEmail);
  el("phone").addEventListener("blur", validatePhone);
  el("password").addEventListener("input", validatePassword);
  el("confirmPassword").addEventListener("input", validateConfirmPassword);
  el("dob").addEventListener("change", validateDob);
  el("club").addEventListener("change", validateClub);
  el("bio").addEventListener("blur", validateBio);
  el("photo").addEventListener("change", validatePhoto);

  document.querySelectorAll('input[name="membershipType"]').forEach(function (r) {
    r.addEventListener("change", validateMembershipType);
  });
  document.querySelectorAll('input[name="interests"]').forEach(function (c) {
    c.addEventListener("change", validateInterests);
  });

 
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const validators = [
      validateFullName,
      validateEmail,
      validatePhone,
      validatePassword,
      validateConfirmPassword,
      validateDob,
      validateClub,
      validateMembershipType,
      validateInterests,
      validateBio,
      validatePhoto,
    ];

  
    const results = validators.map(function (fn) {
      return fn();
    });
    const allValid = results.every(Boolean);

    if (!allValid) {
      
      const firstError = document.querySelector(".show-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    showSummary();
  });

  
  function showSummary() {
    const interests = Array.from(
      document.querySelectorAll('input[name="interests"]:checked')
    )
      .map(function (c) {
        return c.value;
      })
      .join(", ");

    const membershipType = document.querySelector(
      'input[name="membershipType"]:checked'
    ).value;

    const clubLabel = el("club").options[el("club").selectedIndex].text;

    const photoFiles = el("photo").files;
    const photoName = photoFiles.length ? photoFiles[0].name : "Not provided";

    const rows = [
      ["Full name", el("fullName").value.trim()],
      ["Email", el("email").value.trim()],
      ["Phone", el("phone").value.trim()],
      ["Date of birth", el("dob").value],
      ["Club", clubLabel],
      ["Membership type", membershipType],
      ["Interests", interests],
      ["About", el("bio").value.trim()],
      ["Profile photo", photoName],
    ];

    summaryBody.innerHTML = rows
      .map(function (r) {
        return (
          "<tr><th>" +
          escapeHtml(r[0]) +
          "</th><td>" +
          escapeHtml(r[1]) +
          "</td></tr>"
        );
      })
      .join("");

    form.classList.add("d-none");
    successPanel.classList.add("show");
    successPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  editAgainBtn.addEventListener("click", function () {
    successPanel.classList.remove("show");
    form.classList.remove("d-none");
  });


  el("resetBtn").addEventListener("click", function () {
    document.querySelectorAll(".field-wrap").forEach(function (w) {
      w.classList.remove("show-error", "field-ok");
    });
  });

  
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
});
