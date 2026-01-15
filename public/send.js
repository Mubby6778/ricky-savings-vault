function switchForm() {
  const c = country.value;
  ibanBox.style.display = c === "DE" ? "block" : "none";
  usBox.style.display = c === "US" ? "block" : "none";
}

function validate() {
  const c = country.value;
  const amt = amount.value;
  if (amt <= 0) return result.innerText = "Invalid amount";

  if (c === "DE") {
    if (!/^DE\d{20}$/.test(iban.value.replace(/\s/g,"")))
      return result.innerText = "Invalid IBAN";
    confirmSend("Hans Müller", amt);
  }

  if (c === "US") {
    if (!/^\d{9}$/.test(routing.value))
      return result.innerText = "Invalid routing";
    if (!/^\d{6,17}$/.test(account.value))
      return result.innerText = "Invalid account";
    confirmSend("John Smith", amt);
  }
}

function confirmSend(name, amt) {
  if (confirm(`Send $${amt} to ${name}?`))
    alert("Transfer submitted");
}
