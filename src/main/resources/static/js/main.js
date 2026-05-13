// RSSB – Mutuelle de Santé – Main JS

// ---- SEED DATA (no hardcoded members) ----
let users = JSON.parse(localStorage.getItem('rssb_users') || 'null') || [
  { id:'U001', firstName:'Jean', lastName:'Bosco', email:'admin@rssb.rw', password:'Admin@2024', role:'admin', hospital:'' },
  { id:'U002', firstName:'Marie', lastName:'Claire', email:'staff@chuk.rw', password:'Staff@2024', role:'staff', hospital:'CHUK' },
  { id:'U003', firstName:'Patrick', lastName:'Nzeyimana', email:'staff@kibagabaga.rw', password:'Staff@2024', role:'staff', hospital:'Kibagabaga Hospital' }
];
let members = JSON.parse(localStorage.getItem('rssb_members') || '[]');
let payments = JSON.parse(localStorage.getItem('rssb_payments') || '[]');
let currentUser = null;
let currentRole = null;
let activeLoginTab = 'admin';
let memberPhotoBase64 = '';
let regPhotoBase64 = '';
let depPhotoBase64 = '';

function save() {
  localStorage.setItem('rssb_users', JSON.stringify(users));
  localStorage.setItem('rssb_members', JSON.stringify(members));
  localStorage.setItem('rssb_payments', JSON.stringify(payments));
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dashDate').textContent = new Date().toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const saved = sessionStorage.getItem('rssb_session');
  if (saved) { currentUser = JSON.parse(saved); currentRole = currentUser.role; showApp(); }
});

// ---- LOGIN PANEL TOGGLE ----
function showRegisterPanel() {
  document.getElementById('loginPanel').classList.add('hidden');
  document.getElementById('registerPanel').classList.remove('hidden');
}
function showLoginPanel() {
  document.getElementById('registerPanel').classList.add('hidden');
  document.getElementById('loginPanel').classList.remove('hidden');
  document.getElementById('selfRegisterForm').reset();
  document.getElementById('regPhotoPreview').classList.add('hidden');
  document.getElementById('regPhotoDefault').style.display='block';
  regPhotoBase64 = '';
}

function previewDepPhoto(input) {
  if (!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    depPhotoBase64 = e.target.result;
    const img = document.getElementById('depPhotoPreview');
    img.src = depPhotoBase64; img.classList.remove('hidden');
    document.getElementById('depPhotoDefault').style.display = 'none';
  };
  reader.readAsDataURL(input.files[0]);
}

function switchLoginTab(tab) {
  activeLoginTab = tab;
  document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
  const label = document.getElementById('loginEmailLabel');
  const link = document.getElementById('memberRegisterLink');
  if (tab === 'member') {
    label.textContent = 'Email or Phone Number';
    document.getElementById('loginEmail').placeholder = 'Email or phone number';
    link.classList.remove('hidden');
  } else {
    label.textContent = 'Email Address';
    document.getElementById('loginEmail').placeholder = 'Enter your email';
    link.classList.add('hidden');
  }
  document.getElementById('loginError').classList.add('hidden');
}

// ---- LOGIN ----
function doLogin(e) {
  e.preventDefault();
  const credential = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.classList.add('hidden');

  if (activeLoginTab === 'member') {
    const m = members.find(x => (x.email === credential || x.phone === credential) && x.password === password);
    if (!m) { errEl.textContent = 'Invalid email/phone or password.'; errEl.classList.remove('hidden'); return; }
    currentUser = { ...m, role: 'member' };
  } else {
    const u = users.find(x => x.email === credential && x.password === password && x.role === activeLoginTab);
    if (!u) { errEl.textContent = 'Invalid email or password.'; errEl.classList.remove('hidden'); return; }
    currentUser = u;
  }
  currentRole = currentUser.role;
  sessionStorage.setItem('rssb_session', JSON.stringify(currentUser));
  showApp();
}

function doLogout() {
  sessionStorage.removeItem('rssb_session');
  currentUser = null; currentRole = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('loginForm').reset();
  switchLoginTab('admin');
}

// ---- MEMBER SELF-REGISTER ----
function previewRegPhoto(input) {
  if (!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    regPhotoBase64 = e.target.result;
    const img = document.getElementById('regPhotoPreview');
    img.src = regPhotoBase64; img.classList.remove('hidden');
    document.getElementById('regPhotoDefault').style.display = 'none';
  };
  reader.readAsDataURL(input.files[0]);
}

function selfRegisterMember(e) {
  e.preventDefault();
  const errEl = document.getElementById('regError');
  errEl.classList.add('hidden');

  const email = document.getElementById('srEmail').value.trim();
  const phone = document.getElementById('srPhone').value.trim();
  const nationalId = document.getElementById('srNationalId').value.trim();
  const password = document.getElementById('srPassword').value;
  const confirm = document.getElementById('srConfirm').value;

  if (password !== confirm) { errEl.textContent = 'Passwords do not match.'; errEl.classList.remove('hidden'); return; }

  // Under-18 block
  const dobValue = document.getElementById('srDOB').value;
  if (dobValue) {
    const dob = new Date(dobValue);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const mo = today.getMonth() - dob.getMonth();
    if (mo < 0 || (mo === 0 && today.getDate() < dob.getDate())) age--;
    if (age < 18) {
      errEl.textContent = 'You must be 18 or older to self-register. Children under 18 must be added by a parent or guardian as a dependent under their own account.';
      errEl.classList.remove('hidden');
      return;
    }
  }

  if (members.find(m => m.email === email)) { errEl.textContent = 'This email is already registered.'; errEl.classList.remove('hidden'); return; }
  if (members.find(m => m.nationalId === nationalId)) { errEl.textContent = 'This National ID is already registered.'; errEl.classList.remove('hidden'); return; }
  if (!regPhotoBase64) { errEl.textContent = 'Please upload your photo.'; errEl.classList.remove('hidden'); return; }

  const newMember = {
    id: 'MBR-' + String(members.length + 1).padStart(3,'0'),
    firstName: document.getElementById('srFirstName').value.trim(),
    lastName: document.getElementById('srLastName').value.trim(),
    nationalId,
    dob: document.getElementById('srDOB').value,
    phone,
    email,
    password,
    category: document.getElementById('srCategory').value,
    maritalStatus: document.getElementById('srMaritalStatus').value,
    status: 'PENDING',
    photo: regPhotoBase64,
    registrationDate: new Date().toISOString().split('T')[0],
    dependents: []
  };
  members.push(newMember);
  save();
  showToast('Account created! Please sign in.', 'success');
  showLoginPanel();
  switchLoginTab('member');
}

// ---- APP SHELL ----
function showApp() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  document.getElementById('sidebarAvatar').textContent = (currentUser.firstName || 'U')[0].toUpperCase();
  document.getElementById('sidebarName').textContent = (currentUser.firstName||'') + ' ' + (currentUser.lastName||'');
  document.getElementById('sidebarRole').textContent = roleLabel(currentRole);
  buildNav();
  if (currentRole === 'admin') { showSection('sec-dashboard'); loadDashboard(); }
  else if (currentRole === 'staff') showSection('sec-verify');
  else { showSection('sec-member-dashboard'); loadMemberDashboard(); }
}

function roleLabel(r) {
  return r==='admin'?'Administrator':r==='staff'?'Hospital Insurance Staff':'Member';
}

function buildNav() {
  const nav = document.getElementById('sidebarNav');
  const maps = {
    admin: [
      {id:'sec-dashboard',icon:'fa-th-large',label:'Dashboard'},
      {id:'sec-members',icon:'fa-users',label:'Members'},
      {id:'sec-payments',icon:'fa-money-bill-wave',label:'Payments'},
      {id:'sec-users',icon:'fa-users-cog',label:'User Management'}
    ],
    staff: [{id:'sec-verify',icon:'fa-id-card-alt',label:'Verify Member'}],
    member: [
      {id:'sec-member-dashboard',icon:'fa-th-large',label:'Dashboard'},
      {id:'sec-myprofile',icon:'fa-user-circle',label:'My Profile'}
    ]
  };
  nav.innerHTML = (maps[currentRole]||[]).map(i =>
    `<button class="nav-item" id="nav-${i.id}" onclick="showSection('${i.id}')"><i class="fas ${i.icon}"></i> ${i.label}</button>`
  ).join('');
}

function showSection(id) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById(id); if (sec) sec.classList.add('active');
  const nb = document.getElementById('nav-'+id); if (nb) nb.classList.add('active');
  if (id==='sec-dashboard') loadDashboard();
  if (id==='sec-members') renderMembersTable();
  if (id==='sec-payments') renderPaymentsTable();
  if (id==='sec-users') renderUsersTable();
  if (id==='sec-member-dashboard') loadMemberDashboard();
  if (id==='sec-myprofile') loadMyProfile();
}

// ---- ADMIN DASHBOARD ----
function loadDashboard() {
  document.getElementById('statTotal').textContent = members.length;
  document.getElementById('statActive').textContent = members.filter(m=>m.status==='ACTIVE').length;
  document.getElementById('statPending').textContent = members.filter(m=>m.status==='PENDING').length;
  document.getElementById('statExpired').textContent = members.filter(m=>m.status==='EXPIRED').length;
  const tbody = document.getElementById('recentMembersBody');
  const recent = [...members].reverse().slice(0,5);
  tbody.innerHTML = recent.length ? recent.map(m=>`
    <tr>
      <td>${m.photo?`<img src="${m.photo}" class="member-photo-thumb">`:'<div class="photo-placeholder"><i class="fas fa-user"></i></div>'}</td>
      <td><strong>${m.firstName} ${m.lastName}</strong></td>
      <td>${m.nationalId}</td>
      <td>${catLabel(m.category)}</td>
      <td>${statusBadge(m.status)}</td>
    </tr>`).join('') : '<tr><td colspan="5" style="text-align:center;color:#64748b">No members yet</td></tr>';
}

// Quick payment from dashboard
function recordPaymentDash(e) {
  e.preventDefault();
  doPayment(
    document.getElementById('dashPayId').value.trim(),
    parseFloat(document.getElementById('dashPayAmount').value),
    document.getElementById('dashPayMethod').value,
    new Date().getFullYear()
  );
  e.target.reset();
  loadDashboard();
}

// ---- MEMBERS (Admin) ----
function openRegisterForm() {
  document.getElementById('registerFormCard').classList.remove('hidden');
  document.getElementById('registerFormCard').scrollIntoView({behavior:'smooth'});
  memberPhotoBase64 = '';
}
function closeRegisterForm() {
  document.getElementById('registerFormCard').classList.add('hidden');
  document.getElementById('registerFormCard').querySelector('form').reset();
  document.getElementById('photoPreviewImg').classList.add('hidden');
  document.getElementById('photoUploadDefault').style.display='block';
  memberPhotoBase64='';
}
function previewPhoto(input) {
  if (!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    memberPhotoBase64 = e.target.result;
    const img = document.getElementById('photoPreviewImg');
    img.src = memberPhotoBase64; img.classList.remove('hidden');
    document.getElementById('photoUploadDefault').style.display='none';
  };
  reader.readAsDataURL(input.files[0]);
}

function adminRegisterMember(e) {
  e.preventDefault();
  const email = document.getElementById('regEmail').value.trim();
  const nationalId = document.getElementById('regNationalId').value.trim();
  if (members.find(m=>m.email===email)) { showToast('Email already registered!','error'); return; }
  if (members.find(m=>m.nationalId===nationalId)) { showToast('National ID already registered!','error'); return; }
  const m = {
    id:'MBR-'+String(members.length+1).padStart(3,'0'),
    firstName:document.getElementById('regFirstName').value.trim(),
    lastName:document.getElementById('regLastName').value.trim(),
    nationalId,
    dob:document.getElementById('regDOB').value,
    phone:document.getElementById('regPhone').value.trim(),
    email,
    password:document.getElementById('regPassword').value,
    category:document.getElementById('regCategory').value,
    maritalStatus:document.getElementById('regMaritalStatus').value,
    status:'PENDING',
    photo:memberPhotoBase64,
    registrationDate:new Date().toISOString().split('T')[0],
    dependents:[]
  };
  members.push(m); save();
  showToast('Member registered successfully!','success');
  closeRegisterForm(); renderMembersTable(); loadDashboard();
}

function renderMembersTable(list) {
  const data = list||members;
  const tbody = document.getElementById('membersTableBody');
  tbody.innerHTML = data.length ? data.map(m=>`
    <tr>
      <td>${m.photo?`<img src="${m.photo}" class="member-photo-thumb">`:'<div class="photo-placeholder"><i class="fas fa-user"></i></div>'}</td>
      <td><strong>${m.id}</strong></td>
      <td>${m.firstName} ${m.lastName}</td>
      <td>${m.nationalId}</td>
      <td>${m.phone}</td>
      <td>${m.email}</td>
      <td>${catLabel(m.category)}</td>
      <td>${statusBadge(m.status)}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-blue btn-sm" onclick="viewMember('${m.id}')"><i class="fas fa-eye"></i></button>
        <button class="btn btn-yellow btn-sm" onclick="cycleStatus('${m.id}')"><i class="fas fa-sync-alt"></i></button>
        <button class="btn btn-danger btn-sm" onclick="deleteMember('${m.id}')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`).join('') : '<tr><td colspan="9" style="text-align:center;color:#64748b">No members yet</td></tr>';
}

function filterMembers(q) {
  q=q.toLowerCase();
  renderMembersTable(q?members.filter(m=>
    m.firstName.toLowerCase().includes(q)||m.lastName.toLowerCase().includes(q)||
    m.nationalId.includes(q)||m.id.toLowerCase().includes(q)||m.email.toLowerCase().includes(q)
  ):members);
}

function viewMember(id) {
  const m=members.find(x=>x.id===id); if(!m) return;
  document.getElementById('memberDetailContent').innerHTML=`
    <div style="text-align:center;margin-bottom:20px">
      ${m.photo?`<img src="${m.photo}" style="width:110px;height:110px;border-radius:50%;object-fit:cover;border:4px solid #003087">`
      :'<div style="width:110px;height:110px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:2rem;color:#64748b"><i class="fas fa-user"></i></div>'}
      <h2 style="margin-top:12px;color:#003087">${m.firstName} ${m.lastName}</h2>
      ${statusBadge(m.status)}
    </div>
    <table style="width:100%;border-collapse:collapse">
      ${dRow('Member ID',m.id)}${dRow('National ID',m.nationalId)}${dRow('Date of Birth',m.dob)}
      ${dRow('Marital Status', m.maritalStatus ? m.maritalStatus.charAt(0).toUpperCase()+m.maritalStatus.slice(1) : '–')}
      ${dRow('Phone',m.phone)}${dRow('Email',m.email)}${dRow('Category',catLabel(m.category))}
      ${dRow('Registered',m.registrationDate)}
    </table>`;
  document.getElementById('memberDetailModal').classList.remove('hidden');
}
function closeMemberModal(){document.getElementById('memberDetailModal').classList.add('hidden');}

function cycleStatus(id) {
  const m=members.find(x=>x.id===id); if(!m) return;
  const s=['PENDING','ACTIVE','EXPIRED','SUSPENDED'];
  m.status=s[(s.indexOf(m.status)+1)%s.length];
  save(); renderMembersTable(); loadDashboard();
  showToast('Status → '+m.status,'info');
}
function deleteMember(id) {
  if(!confirm('Delete this member?')) return;
  members=members.filter(m=>m.id!==id); save();
  renderMembersTable(); loadDashboard(); showToast('Member deleted','info');
}

// ---- PAYMENTS (Admin) ----
function doPayment(memberId, amount, method, year) {
  const m=members.find(x=>x.id===memberId);
  if(!m){showToast('Member ID not found!','error');return false;}
  const p={receipt:'RCP-'+Date.now(),memberId,memberName:m.firstName+' '+m.lastName,amount,method,year,date:new Date().toISOString().split('T')[0]};
  payments.push(p); m.status='ACTIVE'; save();
  showToast('Payment recorded! Receipt: '+p.receipt,'success');
  return true;
}

function recordPayment(e) {
  e.preventDefault();
  const ok=doPayment(
    document.getElementById('payMemberId').value.trim(),
    parseFloat(document.getElementById('payAmount').value),
    document.getElementById('payMethod').value,
    document.getElementById('payYear').value
  );
  if(ok){e.target.reset();document.getElementById('payYear').value=new Date().getFullYear();renderPaymentsTable();}
}

function renderPaymentsTable() {
  const tbody=document.getElementById('paymentsTableBody');
  tbody.innerHTML=[...payments].reverse().map(p=>`
    <tr>
      <td><strong>${p.receipt}</strong></td>
      <td>${p.memberId}</td>
      <td>${p.memberName||'–'}</td>
      <td><strong>${Number(p.amount).toLocaleString()} RWF</strong></td>
      <td>${p.method}</td>
      <td>${p.year}</td>
      <td>${p.date}</td>
    </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;color:#64748b">No payments yet</td></tr>';
}

// ---- USERS (Admin) ----
function renderUsersTable() {
  document.getElementById('usersTableBody').innerHTML=users.map(u=>`
    <tr>
      <td><strong>${u.firstName} ${u.lastName}</strong></td>
      <td>${u.email}</td>
      <td><span class="badge ${u.role==='admin'?'badge-blue':'badge-green'}">${u.role==='admin'?'Admin':'Hospital Staff'}</span></td>
      <td>${u.hospital||'–'}</td>
      <td><span class="badge badge-green">Active</span></td>
      <td>${u.id!=='U001'?`<button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')"><i class="fas fa-trash"></i></button>`:'<span style="color:#94a3b8;font-size:.8rem">Protected</span>'}</td>
    </tr>`).join('');
}
function openAddUserModal(){document.getElementById('addUserModal').classList.remove('hidden');}
function closeAddUserModal(){document.getElementById('addUserModal').classList.add('hidden');document.getElementById('addUserModal').querySelector('form').reset();}
function toggleHospitalField(){document.getElementById('hospitalFieldWrap').style.opacity=document.getElementById('userRole').value==='staff'?'1':'0.4';}
function addUser(e) {
  e.preventDefault();
  const email=document.getElementById('userEmail').value.trim();
  if(users.find(u=>u.email===email)){showToast('Email already exists!','error');return;}
  users.push({id:'U'+String(users.length+1).padStart(3,'0'),firstName:document.getElementById('userFirstName').value.trim(),lastName:document.getElementById('userLastName').value.trim(),email,password:document.getElementById('userPassword').value,role:document.getElementById('userRole').value,hospital:document.getElementById('userHospital').value.trim()});
  save(); closeAddUserModal(); renderUsersTable(); showToast('User added!','success');
}
function deleteUser(id){if(!confirm('Delete user?'))return;users=users.filter(u=>u.id!==id);save();renderUsersTable();showToast('User removed','info');}

// ---- HOSPITAL STAFF VERIFY ----
function searchForVerify() {
  const q=document.getElementById('verifySearch').value.trim().toLowerCase();
  const r=document.getElementById('verifyResult');
  if(!q){r.innerHTML='';return;}
  const m=members.find(x=>x.nationalId.includes(q)||(x.firstName+' '+x.lastName).toLowerCase().includes(q));
  if(!m){
    r.innerHTML=`<div class="card" style="max-width:480px;margin:0 auto;text-align:center;padding:36px">
      <i class="fas fa-user-times" style="font-size:3rem;color:#ef4444;margin-bottom:12px"></i>
      <h3 style="color:#ef4444">Member Not Found</h3>
      <p style="color:#64748b">No member matches the search. Please check the National ID or name.</p>
    </div>`;
    return;
  }
  r.innerHTML=`
    <div class="verify-card">
      ${m.photo?`<img src="${m.photo}" class="verify-photo" alt="Member Photo">`
      :`<div style="width:140px;height:140px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:3rem;color:#94a3b8"><i class="fas fa-user"></i></div>`}
      <div class="verify-name">${m.firstName} ${m.lastName}</div>
      <div class="verify-id">National ID: ${m.nationalId}</div>
      <div style="margin:10px 0 16px">${statusBadge(m.status)}</div>
      <table style="width:100%;text-align:left;margin-bottom:20px;border-collapse:collapse">
        ${dRow('Member ID',m.id)}${dRow('Phone',m.phone)}
        ${dRow('Category',catLabel(m.category))}${dRow('Date of Birth',m.dob)}
      </table>
      <div class="verify-actions">
        <button class="btn btn-success" onclick="markVerification('verified')"><i class="fas fa-check-circle"></i> Identity Verified</button>
        <button class="btn btn-danger" onclick="markVerification('mismatch')"><i class="fas fa-times-circle"></i> Photo Mismatch</button>
      </div>
      <div id="verifyBadge" style="display:none;padding:14px;border-radius:8px;margin-top:16px;font-size:1rem;font-weight:700"></div>
    </div>`;
}
function markVerification(result) {
  const b=document.getElementById('verifyBadge');
  b.style.display='block';
  if(result==='verified'){b.style.background='#d1fae5';b.style.color='#065f46';b.innerHTML='<i class="fas fa-check-circle"></i> IDENTITY VERIFIED – Insurance Active';}
  else{b.style.background='#fee2e2';b.style.color='#991b1b';b.innerHTML='<i class="fas fa-times-circle"></i> PHOTO MISMATCH – Alert Security';}
}

// ---- MEMBER SELF PORTAL ----
function getMemberRecord() {
  return members.find(x=>x.email===currentUser.email||x.id===currentUser.id);
}

function loadMemberDashboard() {
  const m=getMemberRecord(); if(!m) return;
  // Photo
  const wrap=document.getElementById('mDashPhotoWrap');
  wrap.innerHTML=m.photo?`<img src="${m.photo}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #003087">`
    :`<div style="width:80px;height:80px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:2rem;color:#94a3b8"><i class="fas fa-user"></i></div>`;
  document.getElementById('mDashName').textContent=m.firstName+' '+m.lastName;
  document.getElementById('mDashId').textContent='ID: '+m.id;
  document.getElementById('mDashEmail').textContent=m.email;
  document.getElementById('mDashStatusIcon').textContent=m.status==='ACTIVE'?'✅':m.status==='EXPIRED'?'❌':'⏳';
  document.getElementById('mDashStatus').innerHTML=statusBadge(m.status);
  document.getElementById('mDashCategory').textContent=catLabel(m.category);
  // Pre-fill payment form
  document.getElementById('mPayYear').value = new Date().getFullYear();
  document.getElementById('mPayForDependent').value = '';
  document.getElementById('mPayForDepInfo').classList.add('hidden');
  const catAmounts = { CATEGORY_1:0, CATEGORY_2:3000, CATEGORY_3:5000, CATEGORY_4:8000, CATEGORY_5:20000 };
  const catHints = {
    CATEGORY_1: 'Category I is free – fully covered by the Government (100% subsidy).',
    CATEGORY_2: 'Total: 4,000 RWF/yr. Gov. subsidy: 1,000 RWF. Your payment: 3,000 RWF.',
    CATEGORY_3: 'Suggested: 5,000 RWF/year for Category III (no subsidy).',
    CATEGORY_4: 'Suggested: 8,000 RWF/year for Category IV (no subsidy).',
    CATEGORY_5: 'Suggested: 20,000 RWF/year for Category V (no subsidy).'
  };
  const amt = catAmounts[m.category];
  if (amt !== undefined) {
    document.getElementById('mPayAmount').value = amt || '';
    document.getElementById('mPayHint').textContent = catHints[m.category] || '';
  }
  // Hide receipt banner on load
  document.getElementById('mPayReceipt').classList.add('hidden');
  // My payments table
  renderMyPayments(m);
  // Family card: show only for married / divorced
  const familyCard   = document.getElementById('familyCard');
  const singleNotice = document.getElementById('singleNotice');
  if (m.maritalStatus === 'married' || m.maritalStatus === 'divorced') {
    familyCard.classList.remove('hidden');
    singleNotice.classList.add('hidden');
    renderDependentsTable(m);
  } else {
    familyCard.classList.add('hidden');
    singleNotice.classList.remove('hidden');
  }
}

function renderMyPayments(m) {
  const myPay=payments.filter(p=>p.memberId===m.id);
  const tbody=document.getElementById('myPaymentsBody');
  tbody.innerHTML=myPay.length?[...myPay].reverse().map(p=>`
    <tr>
      <td><strong>${p.receipt}</strong></td>
      <td><strong>${Number(p.amount).toLocaleString()} RWF</strong></td>
      <td>${p.method}</td>
      <td>${p.year}</td>
      <td>${p.date}</td>
    </tr>`).join('')
    :'<tr><td colspan="5" style="text-align:center;color:#64748b">No payments recorded yet.</td></tr>';
}

function memberPay(e) {
  e.preventDefault();
  const m = getMemberRecord(); if (!m) { showToast('Member record not found', 'error'); return; }
  const amount = parseFloat(document.getElementById('mPayAmount').value);
  const method = document.getElementById('mPayMethod').value;
  const year = document.getElementById('mPayYear').value;
  const depIndexVal = document.getElementById('mPayForDependent').value;
  const depIndex = depIndexVal !== '' ? parseInt(depIndexVal) : -1;
  if (!method) { showToast('Please select a payment method', 'error'); return; }

  let payeeName = m.firstName + ' ' + m.lastName;
  let forDependent = null;
  if (depIndex >= 0 && m.dependents && m.dependents[depIndex]) {
    forDependent = m.dependents[depIndex];
    payeeName = m.firstName + ' ' + m.lastName + ' (for: ' + forDependent.firstName + ' ' + forDependent.lastName + ')';
  }

  const p = {
    receipt: 'RCP-' + Date.now(),
    memberId: m.id,
    memberName: payeeName,
    amount, method, year,
    date: new Date().toISOString().split('T')[0],
    ...(forDependent ? { forDependent: forDependent.firstName + ' ' + forDependent.lastName } : {})
  };
  payments.push(p);

  if (forDependent) {
    forDependent.insuranceStatus = 'ACTIVE';
    const idx = members.findIndex(x => x.id === m.id);
    if (idx >= 0) members[idx] = m;
  } else {
    m.status = 'ACTIVE';
    currentUser = { ...currentUser, status: 'ACTIVE' };
    sessionStorage.setItem('rssb_session', JSON.stringify(currentUser));
    document.getElementById('mDashStatusIcon').textContent = '\u2705';
    document.getElementById('mDashStatus').innerHTML = statusBadge('ACTIVE');
  }
  save();

  // Reset dependent selector
  document.getElementById('mPayForDependent').value = '';
  document.getElementById('mPayForDepInfo').classList.add('hidden');

  // Show receipt banner
  const banner = document.getElementById('mPayReceipt');
  banner.classList.remove('hidden');
  const depText = forDependent ? ` | Dependent: ${forDependent.firstName} ${forDependent.lastName}` : '';
  document.getElementById('mPayReceiptText').textContent =
    `Receipt: ${p.receipt} | ${Number(amount).toLocaleString()} RWF | ${method} | Year ${year}${depText}`;

  renderMyPayments(m);
  renderDependentsTable(m);
  showToast('Payment submitted successfully!', 'success');
}

function loadMyProfile() {
  const m=getMemberRecord(); if(!m) return;
  const wrap=document.getElementById('myProfilePhotoWrap');
  wrap.innerHTML=m.photo?`<img src="${m.photo}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:4px solid #003087;display:block;margin:0 auto">`
    :`<div style="width:120px;height:120px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:2.5rem;color:#64748b"><i class="fas fa-user"></i></div>`;
  document.getElementById('myProfileName').textContent=m.firstName+' '+m.lastName;
  document.getElementById('myProfileStatus').innerHTML=statusBadge(m.status);
  const msLabel = m.maritalStatus ? m.maritalStatus.charAt(0).toUpperCase()+m.maritalStatus.slice(1) : '–';
  document.getElementById('myProfileBody').innerHTML=
    dRow('Member ID',m.id)+dRow('National ID',m.nationalId)+dRow('Date of Birth',m.dob)+
    dRow('Marital Status',msLabel)+
    dRow('Phone',m.phone)+dRow('Email',m.email)+dRow('Category',catLabel(m.category))+dRow('Registered',m.registrationDate);
}

// ---- HELPERS ----
function catLabel(c) {
  return {
    CATEGORY_1: 'Cat. I – Free (No Income)',
    CATEGORY_2: 'Cat. II – 4,000 RWF/yr',
    CATEGORY_3: 'Cat. III – 5,000 RWF/yr',
    CATEGORY_4: 'Cat. IV – 8,000 RWF/yr',
    CATEGORY_5: 'Cat. V – 20,000 RWF/yr'
  }[c] || c;
}
function statusBadge(s){return`<span class="badge ${{ACTIVE:'badge-green',PENDING:'badge-yellow',EXPIRED:'badge-red',SUSPENDED:'badge-gray'}[s]||'badge-gray'}">${s}</span>`;}
function dRow(l,v){return`<tr><td style="padding:9px 12px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;width:140px">${l}</td><td style="padding:9px 12px;border-bottom:1px solid #e2e8f0">${v||'–'}</td></tr>`;}
function showToast(msg, type='success') {
  const t = document.getElementById('toast');
  t.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':type==='error'?'exclamation-circle':'info-circle'}"></i> ${msg}`;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ---- FAMILY / DEPENDENTS ----
function openAddDependentModal() {
  document.getElementById('addDependentModal').classList.remove('hidden');
}
function closeAddDependentModal() {
  document.getElementById('addDependentModal').classList.add('hidden');
  document.getElementById('addDependentForm').reset();
  depPhotoBase64 = '';
  document.getElementById('depPhotoPreview').classList.add('hidden');
  document.getElementById('depPhotoDefault').style.display = 'block';
}

function addDependent(e) {
  e.preventDefault();
  const m = getMemberRecord(); if (!m) return;
  const firstName = document.getElementById('depFirstName').value.trim();
  const lastName  = document.getElementById('depLastName').value.trim();
  const dob       = document.getElementById('depDOB').value;
  const nationalId = document.getElementById('depNationalId').value.trim();
  const relationship = document.getElementById('depRelationship').value;

  // Must be under 18
  const dobDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const mo = today.getMonth() - dobDate.getMonth();
  if (mo < 0 || (mo === 0 && today.getDate() < dobDate.getDate())) age--;
  if (age >= 18) {
    showToast('Dependent must be under 18 years old. Adults must register their own account.', 'error');
    return;
  }
  if (!depPhotoBase64) {
    showToast('Please upload the child\'s photo.', 'error');
    return;
  }
  if (!m.dependents) m.dependents = [];
  if (nationalId && m.dependents.find(d => d.nationalId === nationalId)) {
    showToast('This National ID is already added as a dependent.', 'error');
    return;
  }
  // Child inherits parent's Ubudehe category
  m.dependents.push({ firstName, lastName, dob, nationalId, relationship, category: m.category, photo: depPhotoBase64, insuranceStatus: 'PENDING', addedDate: today.toISOString().split('T')[0] });
  const idx = members.findIndex(x => x.id === m.id);
  if (idx >= 0) members[idx] = m;
  save();
  closeAddDependentModal();
  renderDependentsTable(m);
  showToast(`${firstName} added as a dependent!`, 'success');
}

function renderDependentsTable(m) {
  const deps = (m && m.dependents) || [];
  const tbody = document.getElementById('dependentsTableBody');
  if (!tbody) return;
  tbody.innerHTML = deps.length
    ? deps.map((d, i) => `
      <tr>
        <td>${d.photo ? `<img src="${d.photo}" class="member-photo-thumb">` : '<div class="photo-placeholder"><i class="fas fa-child"></i></div>'}</td>
        <td><strong>${d.firstName} ${d.lastName}</strong></td>
        <td>${d.relationship}</td>
        <td>${d.dob}</td>
        <td>${d.nationalId || '\u2013'}</td>
        <td><small>${catLabel(d.category || '')}</small></td>
        <td>${statusBadge(d.insuranceStatus || 'PENDING')}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-yellow btn-sm" onclick="payForDependent(${i})"><i class="fas fa-money-bill-wave"></i> Pay</button>
          <button class="btn btn-danger btn-sm" onclick="removeDependent(${i})"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`).join('')
    : '<tr><td colspan="8" style="text-align:center;color:#64748b">No dependents added yet. Click \u201cAdd Child\u201d to get started.</td></tr>';
}

function payForDependent(index) {
  const m = getMemberRecord(); if (!m) return;
  const dep = (m.dependents || [])[index]; if (!dep) return;
  const catAmounts = { CATEGORY_1:0, CATEGORY_2:3000, CATEGORY_3:5000, CATEGORY_4:8000, CATEGORY_5:20000 };
  const amt = catAmounts[m.category] !== undefined ? catAmounts[m.category] : '';
  document.getElementById('mPayAmount').value = amt;
  document.getElementById('mPayYear').value = new Date().getFullYear();
  document.getElementById('mPayForDependent').value = index;
  document.getElementById('mPayForDepName').textContent = dep.firstName + ' ' + dep.lastName;
  // Show child photo in the banner
  const photoEl  = document.getElementById('mPayForDepPhoto');
  const avatarEl = document.getElementById('mPayForDepAvatar');
  if (dep.photo) {
    photoEl.src = dep.photo;
    photoEl.style.display = 'block';
    avatarEl.style.display = 'none';
  } else {
    photoEl.style.display = 'none';
    avatarEl.style.display = 'flex';
  }
  document.getElementById('mPayForDepInfo').classList.remove('hidden');
  document.getElementById('mPayReceipt').classList.add('hidden');
  document.getElementById('mPayHint').textContent = `Paying for: ${dep.firstName} ${dep.lastName} (${dep.relationship}). Suggested: ${Number(amt).toLocaleString()} RWF/yr based on your category.`;
  document.getElementById('memberPayForm').scrollIntoView({ behavior: 'smooth' });
  showToast(`Payment form set for ${dep.firstName}. Choose a method and submit.`, 'info');
}

function clearDependentPayment() {
  document.getElementById('mPayForDependent').value = '';
  document.getElementById('mPayForDepInfo').classList.add('hidden');
  const m = getMemberRecord();
  if (m) {
    const catAmounts = { CATEGORY_1:0, CATEGORY_2:3000, CATEGORY_3:5000, CATEGORY_4:8000, CATEGORY_5:20000 };
    document.getElementById('mPayAmount').value = catAmounts[m.category] || '';
    document.getElementById('mPayHint').textContent = '';
  }
}

function removeDependent(index) {
  const m = getMemberRecord(); if (!m) return;
  if (!confirm('Remove this dependent from your family plan?')) return;
  m.dependents.splice(index, 1);
  const idx = members.findIndex(x => x.id === m.id);
  if (idx >= 0) members[idx] = m;
  save();
  renderDependentsTable(m);
  showToast('Dependent removed.', 'info');
}