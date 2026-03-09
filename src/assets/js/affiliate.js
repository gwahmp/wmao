/* ================================
   CONFIG
================================ */

const SUPABASE_URL = "https://nbphjkegjgwkkqdvgimc.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5icGhqa2Vnamd3a2txZHZnaW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDY0MTYsImV4cCI6MjA4ODM4MjQxNn0.o9koZ-kuUTerJ09SzNByL3ll0U0eD7PLcidX4AmxFx0";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
let dn, em, wb, tw, ln, aid;

dn=localStorage.getItem("dn",dn || ""); 
em=localStorage.getItem("em",em || ""); 
wb=localStorage.getItem("wb",wb || ""); 
ln=localStorage.getItem("ln",ln || ""); 
tw=localStorage.getItem("tw",tw || ""); 
aid=localStorage.getItem("aid",aid || ""); 

/* ================================
   INIT
================================ */

document.addEventListener("DOMContentLoaded", async () => {

  captureReferral()

  const { data:{session} } = await supabaseClient.auth.getSession()

  if(session){
    onLoginState()
  }else{
    onLogoutState()
  }

})


/* ================================
   UI STATE
================================ */

function onLoginState(){
  document.getElementById("loginRegister")?.classList.add("hidden")
  document.getElementById("accountSection")?.classList.remove("hidden")
  document.getElementById("welcome").innerText = dn

  showAffiliateLink()
  loadProfile()
}

function onLogoutState(){
  document.getElementById("loginRegister")?.classList.remove("hidden")
  document.getElementById("accountSection")?.classList.add("hidden")

  const refInput = document.getElementById("myref")
  if(refInput) refInput.value = ""
}


/* ================================
   REFERRAL COOKIE
================================ */

function captureReferral(){

  const params = new URLSearchParams(window.location.search)
  const ref = params.get("ref")

  if(ref){
    document.cookie = "affiliate_ref="+ref+"; path=/; max-age=2592000"
  }

}


/* ================================
   REGISTER
================================ */

window.registerUser = async function(){

  const email = document.getElementById("reg_email").value
  const password = document.getElementById("reg_pass").value

  await signup(email,password)

}

async function signup(email,password){

  let cookieRef = getCookie("affiliate_ref")

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  })

  if(error){
    alert(error.message)
    return
  }

  if(data.user){

    const affiliateCode = await generateUniqueAffiliateCode()

    const { error:insertError } = await supabaseClient
      .from("users")
      .insert({
        id:data.user.id,
        email:email,
        affiliate_code:affiliateCode,
        referrer_id:cookieRef || null
      })

    if(insertError){
      console.error(insertError)
    }

  }

  alert("Signup success")

}


/* ================================
   LOGIN
================================ */

window.loginUser = async function(){

  const email = document.getElementById("login_email").value
  const password = document.getElementById("login_pass").value

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  })

  if(error){
    alert(error.message)
    return
  }

  onLoginState()
  setUserData();
  window.location.reload();


}

async function setUserData(){

  const { data:{user} } = await supabaseClient.auth.getUser()
  
  const { data } = await supabaseClient
  .from("users")
  .select("*")
  .eq("id",user.id)
  .single()
  
  dn= data.name || ""; em=data.email || ""; wb=data.website || ""; ln=data.linkedin || ""; tw=data.twitter || "";aid=data.affiliate_code || "";
  localStorage.setItem("dn",dn || ""); 
  localStorage.setItem("em",em || ""); 
  localStorage.setItem("wb",wb || ""); 
  localStorage.setItem("ln",ln || ""); 
  localStorage.setItem("tw",tw || ""); 
  localStorage.setItem("aid",aid || ""); 

  loadProfile();
}
/* ================================
   FORGOT PASSWORD
================================ */

async function checkRecoveryMode(){

  const hash = window.location.hash
  
  if(hash.includes("type=recovery")){
  
  document.getElementById("resetPasswordSection").classList.remove("hidden")
  
  document.getElementById("loginSection").classList.add("hidden")
  document.getElementById("registerSection").classList.add("hidden")
  
  }
  
  }
  
  checkRecoveryMode()


window.forgotPassword = async function(){

  const email = document.getElementById("login_email").value
  
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email,{
   redirectTo: window.location.origin + "/test"
  })
  
  if(error){
   alert(error.message)
  }else{
   alert("Password reset email sent")
  }
  
  }

  window.updatePassword = async function(){

    const password =
    document.getElementById("newPassword").value
    
    const { error } = await supabaseClient.auth.updateUser({
    password
    })
    
    if(error){
    alert(error.message)
    }else{
    alert("Password updated")
    window.location.href="/account"
    }
    
    }

/* ================================
   CHANGE PASSWORD
================================ */
  window.changePassword = async function(){

    const password = document.getElementById("new_password").value
    
    const { error } = await supabaseClient.auth.updateUser({
     password: password
    })
    
    if(error){
     alert(error.message)
    }else{
     alert("Password updated")
    }
    
    }

/* ================================
   LOGOUT
================================ */

window.logoutUser = async function(){

  await supabaseClient.auth.signOut()

  onLogoutState()
  window.location.reload();

}

/* ================================
   UPDATE PROFILE
================================ */
window.updateProfile = async function(){

  const { data:{user} } = await supabaseClient.auth.getUser()
  
  const name = document.getElementById("profile_name").value
  const website = document.getElementById("profile_website").value
  const twitter = document.getElementById("profile_twitter").value
  const linkedin = document.getElementById("profile_linkedin").value
  
  const { error } = await supabaseClient
  .from("users")
  .update({
   name,
   website,
   twitter,
   linkedin
  })
  .eq("id",user.id)
  
  if(error){
   alert(error.message)
  }else{
   alert("Profile updated")
  }
  
  }


/* ================================
   LOAD PROFILE
================================ */
 function loadProfile(){


  
  document.getElementById("profile_name").value = dn;
  document.getElementById("profile_website").value = wb;
  document.getElementById("profile_twitter").value = tw;
  document.getElementById("profile_linkedin").value = ln;
  
  }

  /* ================================
   DELETE ACCOUNT
================================ */

  window.deleteAccount = async function(){

    if(!confirm("Delete account permanently?")) return
    
    const { data:{user} } = await supabaseClient.auth.getUser()
    
    await supabaseClient.functions.invoke("delete-user",{
     body:{user_id:user.id}
    })
    
    alert("Account deleted")
    
    }

/* ================================
   AFFILIATE LINK
================================ */

async function showAffiliateLink(){

  // const { data:{user} } = await supabaseClient.auth.getUser()

  // if(!user) return

  // const { data } = await supabaseClient
  //   .from("users")
  //   .select("affiliate_code")
  //   .eq("id",user.id)
  //   .single()

  // if(!data) return

  const link = window.location.origin + "/?ref=" + aid

  document.getElementById("myref").value = link

}


/* ================================
   COPY AFFILIATE LINK
================================ */

window.copyAffiliate = function(){

  const input = document.getElementById("myref")

  input.select()
  navigator.clipboard.writeText(input.value)

  alert("Affiliate link copied!")

}


/* ================================
   PURCHASE TRACKING
================================ */

async function recordPurchase(amount){

  const { data:{user} } = await supabaseClient.auth.getUser()

  let referrer = null

  if(user){

    const { data } = await supabaseClient
      .from("users")
      .select("referrer_id")
      .eq("id",user.id)
      .single()

    referrer = data?.referrer_id

  }else{

    referrer = getCookie("affiliate_ref")

  }

  if(!referrer) return

  await supabaseClient
    .from("purchases")
    .insert({
      user_id:user?.id,
      referrer_id:referrer,
      amount:amount,
      commission:amount*0.30
    })

}


/* ================================
   LEADERBOARD
================================ */

async function loadLeaderboard(){

  const { data } = await supabaseClient
    .from("purchases")
    .select("referrer_id, commission")

  let totals = {}

  data.forEach(row=>{
    totals[row.referrer_id] =
      (totals[row.referrer_id] || 0) + row.commission
  })

  const sorted = Object.entries(totals)
    .sort((a,b)=>b[1]-a[1])

  const container = document.getElementById("leaderboard")

  if(!container) return

  container.innerHTML = ""

  sorted.slice(0,10).forEach(item=>{
    const div=document.createElement("div")
    div.innerText=item[0]+" : $"+item[1]
    container.appendChild(div)
  })

}


/* ================================
   AFFILIATE CODE GENERATOR
================================ */

function generateAffiliateCode(length=6){

  const chars="abcdefghijklmnopqrstuvwxyz0123456789"

  let code=""

  for(let i=0;i<length;i++){
    code+=chars[Math.floor(Math.random()*chars.length)]
  }

  return code

}

async function generateUniqueAffiliateCode(){

  let code
  let exists=true

  while(exists){

    code=generateAffiliateCode()

    const { data } = await supabaseClient
      .from("users")
      .select("affiliate_code")
      .eq("affiliate_code",code)
      .single()

    if(!data) exists=false

  }

  return code

}


/* ================================
   COOKIE HELPER
================================ */

function getCookie(name){

  return document.cookie
    .split('; ')
    .find(row=>row.startsWith(name+'='))
    ?.split('=')[1]

}