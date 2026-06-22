<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ get_setting('website_name') }} | Premium Matrimony</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Bootstrap CSS (from project bundle) -->
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <!-- Premium CSS -->
    <link rel="stylesheet" href="{{ asset('css/premium-matrimony.css') }}">
</head>
<body>
    <header class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="/">
                <span style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: #9B1B30;">
                    <i class="fa-solid fa-heart-pulse me-2"></i>VIVAAH SETU
                </span>
            </a>
            <div class="ms-auto d-flex align-items-center">
                @auth
                    <a href="{{ route('dashboard') }}" class="btn btn-premium btn-sm ms-3">Dashboard</a>
                @else
                    <a href="{{ route('login') }}" class="nav-link text-dark fw-bold px-3">Login</a>
                    <a href="{{ route('register') }}" class="btn btn-premium btn-sm ms-3">Join Free</a>
                @endauth
            </div>
        </div>
    </header>

    <section class="premium-hero">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-7 text-center text-lg-start">
                    <h1 class="hero-title mb-3">Where Elite Souls Find Their <span class="text-white">Destined Match.</span></h1>
                    <p class="hero-subtitle mb-4">A premium, discreet matrimonial platform for successful professionals and high-value families across India.</p>
                    <div class="d-flex flex-wrap justify-content-center justify-content-lg-start gap-4 mb-5">
                        <div class="d-flex align-items-center text-white">
                            <i class="fa-solid fa-shield-halved me-2 text-gold"></i> Verified Profiles
                        </div>
                        <div class="d-flex align-items-center text-white">
                            <i class="fa-solid fa-user-tie me-2 text-gold"></i> Personal Matchmakers
                        </div>
                        <div class="d-flex align-items-center text-white">
                            <i class="fa-solid fa-lock me-2 text-gold"></i> 100% Discrete
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="glass-card text-white">
                        <h3 class="mb-4 text-center" style="font-weight: 600;">Begin Your Journey</h3>
                        <form action="{{ route('register') }}" method="GET">
                            <div class="mb-3">
                                <label class="form-label small">I am looking for a</label>
                                <select name="gender" class="form-select bg-white text-dark">
                                    <option value="female">Woman</option>
                                    <option value="male">Man</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small">Within Age Group</label>
                                <div class="d-flex gap-2">
                                    <input type="number" class="form-control" placeholder="21" value="21">
                                    <span class="align-self-center">to</span>
                                    <input type="number" class="form-control" placeholder="35" value="35">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-premium w-100 mt-3">Search Your Destiny</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-5 bg-premium-light">
        <div class="container">
            <div class="text-center mb-5">
                <h2 style="font-family: 'Playfair Display', serif; color: #5D0E1D;">The Premium Advantage</h2>
                <div style="height: 3px; width: 60px; background: #D4AF37; margin: 10px auto;"></div>
                <p class="text-muted mt-3">Exceptional service for exceptional individuals.</p>
            </div>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="feature-card h-100">
                        <i class="fa-solid fa-eye-slash feature-icon"></i>
                        <h4 class="mb-3">Total Profile Invisibility</h4>
                        <p class="text-muted small">Your profile remains hidden from public searches, ensuring complete discretion and privacy.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card h-100">
                        <i class="fa-solid fa-user-check feature-icon"></i>
                        <h4 class="mb-3">Dedicated Matchmakers</h4>
                        <p class="text-muted small">Assigned personal Relationship Managers who understand your lifestyle and values.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card h-100">
                        <i class="fa-solid fa-certificate feature-icon"></i>
                        <h4 class="mb-3">Rigorous Verification</h4>
                        <p class="text-muted small">We mandate government IDs, income slips, and university degrees for every elite member.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card h-100">
                        <i class="fa-solid fa-ban feature-icon"></i>
                        <h4 class="mb-3">Anti-Screenshot Shield</h4>
                        <p class="text-muted small">In-app walls block users from capturing screenshots or saving your gallery photos.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card h-100">
                        <i class="fa-solid fa-crown feature-icon"></i>
                        <h4 class="mb-3">Priority Placement</h4>
                        <p class="text-muted small">Your profile gets a premium badge and is pinned at the top of partner discovery results.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card h-100">
                        <i class="fa-solid fa-handshake feature-icon"></i>
                        <h4 class="mb-3">Mediated Introductions</h4>
                        <p class="text-muted small">Consultants handle the initial outreach, pitching your profile and scheduling family meetings.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="py-5 bg-dark text-white text-center">
        <div class="container">
            <h5 class="mb-4" style="font-family: 'Playfair Display', serif; color: #D4AF37;">VIVAAH SETU</h5>
            <p class="small opacity-50 mb-0">&copy; 2026 Vivahasetu Matrimonials. All rights reserved.</p>
            <p class="small opacity-50">Designed for the Discerning Individual.</p>
        </div>
    </footer>
</body>
</html>
