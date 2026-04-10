<?php
/**
 * SleePare Child Theme Functions
 * Mattress Comparison Tool with WordPress Integration
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// ============================================
// TABLE NAMES (Hardcoded as per your database)
// ============================================
define('SP_MATTRESS_BRANDS', 'wp_sp_mattress_brands');
define('SP_MATTRESS_MODELS', 'wp_sp_mattress_models');
define('SP_EXPERT_SCORES', 'wp_sp_expert_scores');

// ============================================
// CREATE TABLES ON THEME ACTIVATION
// ============================================
function sp_create_tables() {
    global $wpdb;
    
    $charset_collate = $wpdb->get_charset_collate();
    
    // Brands table
    $brands_table = SP_MATTRESS_BRANDS;
    $sql_brands = "CREATE TABLE IF NOT EXISTS $brands_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        logo TEXT,
        rating DECIMAL(3,1) DEFAULT 4.5,
        warranty VARCHAR(100) DEFAULT '10 years',
        trial VARCHAR(100) DEFAULT '100 nights',
        expert_summary TEXT,
        accent_color VARCHAR(7) DEFAULT '#2C5F8A',
        customer_rating_count INT DEFAULT 0,
        customer_comfort DECIMAL(3,1) DEFAULT 4.5,
        customer_support DECIMAL(3,1) DEFAULT 4.5,
        customer_cooling DECIMAL(3,1) DEFAULT 4.5,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) $charset_collate;";
    
    // Models table
    $models_table = SP_MATTRESS_MODELS;
    $sql_models = "CREATE TABLE IF NOT EXISTS $models_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        brand_id INT NOT NULL,
        name VARCHAR(200) NOT NULL,
        type VARCHAR(50) DEFAULT 'Hybrid',
        type_category VARCHAR(20) DEFAULT 'hybrid',
        firmness DECIMAL(3,1) DEFAULT 6,
        firmness_text VARCHAR(50) DEFAULT 'Medium',
        price VARCHAR(100),
        price_value INT DEFAULT 0,
        best_for VARCHAR(255),
        sleep_position TEXT,
        key_features TEXT,
        tagline TEXT,
        cooling VARCHAR(255),
        motion_isolation VARCHAR(50) DEFAULT 'Good',
        edge_support VARCHAR(50) DEFAULT 'Good',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (brand_id) REFERENCES $brands_table(id) ON DELETE CASCADE,
        INDEX (brand_id)
    ) $charset_collate;";
    
    // Expert scores table
    $scores_table = SP_EXPERT_SCORES;
    $sql_scores = "CREATE TABLE IF NOT EXISTS $scores_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        brand_id INT NOT NULL,
        type_score INT DEFAULT 7,
        support_score INT DEFAULT 7,
        value_score INT DEFAULT 7,
        price_score INT DEFAULT 7,
        materials_score INT DEFAULT 7,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (brand_id) REFERENCES $brands_table(id) ON DELETE CASCADE,
        UNIQUE KEY brand_id (brand_id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql_brands);
    dbDelta($sql_models);
    dbDelta($sql_scores);
    
    // Insert default data if tables are empty
    $brand_count = $wpdb->get_var("SELECT COUNT(*) FROM $brands_table");
    if ($brand_count == 0) {
        sp_insert_default_data();
    }
}
add_action('after_switch_theme', 'sp_create_tables');

// ============================================
// INSERT DEFAULT MATTRESS DATA
// ============================================
function sp_insert_default_data() {
    global $wpdb;
    
    // Default data from mattresses.json
    $default_data = array(
        'Avocado' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/avocado-logo.png',
            'rating' => 4.9,
            'warranty' => '25 years',
            'trial' => '365 nights',
            'expert_summary' => 'Avocado is the most eco-friendly mattress on the market, made with organic materials and no harmful chemicals.',
            'accent_color' => '#5A8F4C',
            'customer_rating_count' => 1245,
            'customer_comfort' => 4.7,
            'customer_support' => 4.8,
            'customer_cooling' => 4.6,
            'scores' => array('type_score' => 9, 'support_score' => 8, 'value_score' => 9, 'price_score' => 7, 'materials_score' => 10),
            'models' => array(
                array(
                    'name' => 'Avocado Green',
                    'type' => 'Hybrid / Latex',
                    'type_category' => 'hybrid',
                    'firmness' => 6,
                    'firmness_text' => 'Medium',
                    'price' => '$1,299 – $2,399',
                    'price_value' => 1599,
                    'best_for' => 'Eco-conscious, back sleepers',
                    'sleep_position' => json_encode(array('back', 'stomach')),
                    'key_features' => json_encode(array('Organic', 'Natural Latex', 'Eco-friendly', 'No Chemicals')),
                    'tagline' => 'The world\'s most non-toxic mattress',
                    'cooling' => 'Natural latex, organic cotton',
                    'motion_isolation' => 'Good',
                    'edge_support' => 'Very Good'
                )
            )
        ),
        'Bear' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/bear-logo.png',
            'rating' => 4.8,
            'warranty' => 'Lifetime',
            'trial' => '120 nights',
            'expert_summary' => 'Bear mattresses are designed for athletes and active individuals who need recovery support.',
            'accent_color' => '#D47B3A',
            'customer_rating_count' => 19000,
            'customer_comfort' => 4.8,
            'customer_support' => 4.7,
            'customer_cooling' => 4.6,
            'scores' => array('type_score' => 8, 'support_score' => 9, 'value_score' => 9, 'price_score' => 8, 'materials_score' => 8),
            'models' => array(
                array(
                    'name' => 'Bear Original',
                    'type' => 'Memory Foam',
                    'type_category' => 'foam',
                    'firmness' => 6,
                    'firmness_text' => 'Medium',
                    'price' => '$695 – $1,195',
                    'price_value' => 895,
                    'best_for' => 'Athletes, back pain',
                    'sleep_position' => json_encode(array('back', 'side')),
                    'key_features' => json_encode(array('Celliant Cover', 'Cooling Gel', 'Athlete Recovery')),
                    'tagline' => 'Engineered for performance recovery',
                    'cooling' => 'Graphite-infused foam',
                    'motion_isolation' => 'Excellent',
                    'edge_support' => 'Good'
                ),
                array(
                    'name' => 'Bear Elite Hybrid',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 6.5,
                    'firmness_text' => 'Medium-Firm',
                    'price' => '$1,195 – $2,195',
                    'price_value' => 1595,
                    'best_for' => 'All sleep positions, hot sleepers',
                    'sleep_position' => json_encode(array('back', 'side', 'stomach', 'combination')),
                    'key_features' => json_encode(array('Zoned Support', 'Cooling Cover', 'Premium Hybrid')),
                    'tagline' => 'Luxury cooling with zoned support',
                    'cooling' => 'Phase change material cover',
                    'motion_isolation' => 'Very Good',
                    'edge_support' => 'Excellent'
                )
            )
        ),
        'Brooklyn Bedding' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/brooklynBedding-logo.png',
            'rating' => 4.7,
            'warranty' => '10 years',
            'trial' => '120 nights',
            'expert_summary' => 'Brooklyn Bedding offers premium hybrid mattresses with customizable firmness options.',
            'accent_color' => '#2C5F8A',
            'customer_rating_count' => 8500,
            'customer_comfort' => 4.6,
            'customer_support' => 4.7,
            'customer_cooling' => 4.8,
            'scores' => array('type_score' => 9, 'support_score' => 9, 'value_score' => 8, 'price_score' => 7, 'materials_score' => 9),
            'models' => array(
                array(
                    'name' => 'Brooklyn Bedding',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 6,
                    'firmness_text' => 'Selectable',
                    'price' => '$1,499 – $2,799',
                    'price_value' => 1999,
                    'best_for' => 'Hot sleepers, couples',
                    'sleep_position' => json_encode(array('back', 'side', 'stomach', 'combination')),
                    'key_features' => json_encode(array('Cooling', 'CopperFlex Foam', 'GlacioTex Cover')),
                    'tagline' => 'The coolest hybrid mattress',
                    'cooling' => 'GlacioTex cooling cover',
                    'motion_isolation' => 'Very Good',
                    'edge_support' => 'Excellent'
                ),
                array(
                    'name' => 'Sedona Elite',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 6,
                    'firmness_text' => 'Medium',
                    'price' => '$1,799 – $3,199',
                    'price_value' => 2399,
                    'best_for' => 'Luxury seekers, side sleepers',
                    'sleep_position' => json_encode(array('side', 'back')),
                    'key_features' => json_encode(array('Premium Comfort', 'Zoned Support', 'Plush Feel')),
                    'tagline' => 'Ultimate plush comfort with coil support',
                    'cooling' => 'Gel-infused foam',
                    'motion_isolation' => 'Excellent',
                    'edge_support' => 'Very Good'
                ),
                array(
                    'name' => 'Plank Firm',
                    'type' => 'Flippable Foam',
                    'type_category' => 'foam',
                    'firmness' => 9,
                    'firmness_text' => 'Firm / Extra-Firm',
                    'price' => '$1,099 – $1,999',
                    'price_value' => 1499,
                    'best_for' => 'Stomach sleepers, firm preference',
                    'sleep_position' => json_encode(array('stomach', 'back')),
                    'key_features' => json_encode(array('Flippable', 'Extra-Firm', 'Supportive')),
                    'tagline' => 'America\'s firmest mattress',
                    'cooling' => 'Optional cooling topper',
                    'motion_isolation' => 'Good',
                    'edge_support' => 'Excellent'
                )
            )
        ),
        'Casper' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/casper-logo.png',
            'rating' => 4.8,
            'warranty' => '10 years',
            'trial' => '100 nights',
            'expert_summary' => 'Casper mattresses feature zoned support for targeted pressure relief and balanced comfort.',
            'accent_color' => '#2C5F8A',
            'customer_rating_count' => 42900,
            'customer_comfort' => 4.7,
            'customer_support' => 4.6,
            'customer_cooling' => 4.4,
            'scores' => array('type_score' => 8, 'support_score' => 9, 'value_score' => 8, 'price_score' => 7, 'materials_score' => 8),
            'models' => array(
                array(
                    'name' => 'Casper Original',
                    'type' => 'Memory Foam',
                    'type_category' => 'foam',
                    'firmness' => 6.5,
                    'firmness_text' => 'Medium-Firm',
                    'price' => '$995 – $1,795',
                    'price_value' => 1295,
                    'best_for' => 'Back sleepers, couples',
                    'sleep_position' => json_encode(array('back', 'combination')),
                    'key_features' => json_encode(array('Zoned Support', 'AirScape Foam', 'Breathable')),
                    'tagline' => 'Engineered for the way you sleep',
                    'cooling' => 'AirScape breathable foam',
                    'motion_isolation' => 'Excellent',
                    'edge_support' => 'Good'
                ),
                array(
                    'name' => 'Casper Nova Hybrid',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 5.5,
                    'firmness_text' => 'Medium-Soft',
                    'price' => '$1,495 – $2,295',
                    'price_value' => 1895,
                    'best_for' => 'Side sleepers, pressure relief',
                    'sleep_position' => json_encode(array('side')),
                    'key_features' => json_encode(array('AirScape', 'Zoned Support', 'Plush')),
                    'tagline' => 'Cloud-like pressure relief',
                    'cooling' => 'AirScape foam, breathable cover',
                    'motion_isolation' => 'Excellent',
                    'edge_support' => 'Very Good'
                )
            )
        ),
        'DreamCloud' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/dreamcloud-logo.png',
            'rating' => 4.7,
            'warranty' => 'Lifetime',
            'trial' => '365 nights',
            'expert_summary' => 'DreamCloud brings luxury hybrid construction at an accessible price point with a lifetime warranty.',
            'accent_color' => '#4B6A9B',
            'customer_rating_count' => 7340,
            'customer_comfort' => 4.7,
            'customer_support' => 4.6,
            'customer_cooling' => 4.5,
            'scores' => array('type_score' => 8, 'support_score' => 8, 'value_score' => 9, 'price_score' => 9, 'materials_score' => 8),
            'models' => array(
                array(
                    'name' => 'DreamCloud Hybrid',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 6.5,
                    'firmness_text' => 'Medium-Firm',
                    'price' => '$899 – $1,399',
                    'price_value' => 1099,
                    'best_for' => 'Back sleepers, value seekers',
                    'sleep_position' => json_encode(array('back', 'stomach')),
                    'key_features' => json_encode(array('Cashmere Cover', 'Lifetime Warranty', 'Premium Hybrid')),
                    'tagline' => 'Luxury you can afford',
                    'cooling' => 'Gel memory foam',
                    'motion_isolation' => 'Good',
                    'edge_support' => 'Excellent'
                ),
                array(
                    'name' => 'DreamCloud Premier',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 5,
                    'firmness_text' => 'Medium-Soft',
                    'price' => '$1,299 – $1,999',
                    'price_value' => 1599,
                    'best_for' => 'Side sleepers, luxury feel',
                    'sleep_position' => json_encode(array('side')),
                    'key_features' => json_encode(array('Cashmere Blend', 'Extra Plush', 'Cooling')),
                    'tagline' => 'The ultimate luxury hybrid',
                    'cooling' => 'Gel memory foam, breathable coils',
                    'motion_isolation' => 'Very Good',
                    'edge_support' => 'Excellent'
                )
            )
        ),
        'GhostBed' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/ghostbed-logo.png',
            'rating' => 4.6,
            'warranty' => '20 years',
            'trial' => '101 nights',
            'expert_summary' => 'GhostBed mattresses are designed for maximum cooling and pressure relief.',
            'accent_color' => '#6C3483',
            'customer_rating_count' => 15800,
            'customer_comfort' => 4.5,
            'customer_support' => 4.6,
            'customer_cooling' => 4.9,
            'scores' => array('type_score' => 8, 'support_score' => 8, 'value_score' => 8, 'price_score' => 7, 'materials_score' => 8),
            'models' => array(
                array(
                    'name' => 'GhostBed Original',
                    'type' => 'Memory Foam',
                    'type_category' => 'foam',
                    'firmness' => 7,
                    'firmness_text' => 'Firm',
                    'price' => '$995 – $1,395',
                    'price_value' => 1195,
                    'best_for' => 'Hot sleepers, back sleepers',
                    'sleep_position' => json_encode(array('back', 'stomach')),
                    'key_features' => json_encode(array('Gel Memory Foam', 'Cooling', 'Affordable')),
                    'tagline' => 'Cooler than traditional memory foam',
                    'cooling' => 'Gel-infused memory foam',
                    'motion_isolation' => 'Very Good',
                    'edge_support' => 'Good'
                ),
                array(
                    'name' => 'GhostBed Luxe',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 6,
                    'firmness_text' => 'Medium',
                    'price' => '$1,695 – $2,495',
                    'price_value' => 2095,
                    'best_for' => 'Hot sleepers, all positions',
                    'sleep_position' => json_encode(array('back', 'side', 'combination')),
                    'key_features' => json_encode(array('Cooling Cover', 'Ghost Bounce', 'Premium')),
                    'tagline' => 'The coolest mattress on the market',
                    'cooling' => 'Ghost Ice cover, gel foam',
                    'motion_isolation' => 'Excellent',
                    'edge_support' => 'Very Good'
                )
            )
        ),
        'Helix' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/helix-logo.png',
            'rating' => 4.7,
            'warranty' => '10 years',
            'trial' => '100 nights',
            'expert_summary' => 'Helix offers personalized sleep with a quiz that matches you to the perfect comfort level.',
            'accent_color' => '#00A86B',
            'customer_rating_count' => 56700,
            'customer_comfort' => 4.7,
            'customer_support' => 4.7,
            'customer_cooling' => 4.5,
            'scores' => array('type_score' => 9, 'support_score' => 9, 'value_score' => 8, 'price_score' => 8, 'materials_score' => 8),
            'models' => array(
                array(
                    'name' => 'Helix Core',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 5.5,
                    'firmness_text' => 'Medium',
                    'price' => '$936 – $1,849',
                    'price_value' => 1199,
                    'best_for' => 'All sleep positions, budget',
                    'sleep_position' => json_encode(array('back', 'side', 'stomach', 'combination')),
                    'key_features' => json_encode(array('Hybrid', 'Pressure Relief', 'Value')),
                    'tagline' => 'Balanced support for every sleeper',
                    'cooling' => 'Gel-infused foam',
                    'motion_isolation' => 'Good',
                    'edge_support' => 'Very Good'
                ),
                array(
                    'name' => 'Helix Luxe',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 6,
                    'firmness_text' => 'Selectable',
                    'price' => '$1,399 – $2,499',
                    'price_value' => 1899,
                    'best_for' => 'Personalized comfort',
                    'sleep_position' => json_encode(array('back', 'side', 'stomach', 'combination')),
                    'key_features' => json_encode(array('Zoned Support', 'Premium Foam', 'Cooling')),
                    'tagline' => 'Premium support with cooling',
                    'cooling' => 'Phase change material cover',
                    'motion_isolation' => 'Very Good',
                    'edge_support' => 'Excellent'
                ),
                array(
                    'name' => 'Helix Birch',
                    'type' => 'Natural Latex',
                    'type_category' => 'latex',
                    'firmness' => 6,
                    'firmness_text' => 'Medium',
                    'price' => '$1,299 – $2,299',
                    'price_value' => 1699,
                    'best_for' => 'Eco-conscious, combination sleepers',
                    'sleep_position' => json_encode(array('back', 'side', 'combination')),
                    'key_features' => json_encode(array('Natural Latex', 'Organic Cotton', 'Eco-friendly')),
                    'tagline' => 'Naturally comfortable',
                    'cooling' => 'Natural latex, wool layer',
                    'motion_isolation' => 'Good',
                    'edge_support' => 'Very Good'
                )
            )
        ),
        'Leesa' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/leesa-logo.png',
            'rating' => 4.7,
            'warranty' => '10 years',
            'trial' => '100 nights',
            'expert_summary' => 'Leesa combines premium foam layers for universal comfort and pressure relief.',
            'accent_color' => '#4A6A5E',
            'customer_rating_count' => 27200,
            'customer_comfort' => 4.8,
            'customer_support' => 4.7,
            'customer_cooling' => 4.5,
            'scores' => array('type_score' => 8, 'support_score' => 9, 'value_score' => 9, 'price_score' => 8, 'materials_score' => 8),
            'models' => array(
                array(
                    'name' => 'Leesa Original',
                    'type' => 'Memory Foam',
                    'type_category' => 'foam',
                    'firmness' => 6,
                    'firmness_text' => 'Medium',
                    'price' => '$999 – $1,699',
                    'price_value' => 1199,
                    'best_for' => 'All sleep positions',
                    'sleep_position' => json_encode(array('back', 'side', 'stomach', 'combination')),
                    'key_features' => json_encode(array('Pressure Relief', 'Universal Comfort', 'Eco-friendly')),
                    'tagline' => 'Sleep better, do good',
                    'cooling' => 'Breathable foam, cooling top',
                    'motion_isolation' => 'Excellent',
                    'edge_support' => 'Good'
                ),
                array(
                    'name' => 'Leesa Sapira Hybrid',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 6.5,
                    'firmness_text' => 'Medium-Firm',
                    'price' => '$1,399 – $2,099',
                    'price_value' => 1699,
                    'best_for' => 'Couples, combination sleepers',
                    'sleep_position' => json_encode(array('back', 'side', 'combination')),
                    'key_features' => json_encode(array('Zoned Support', 'Responsive', 'Cooling')),
                    'tagline' => 'The best of both worlds',
                    'cooling' => 'Breathable foam, pocketed coils',
                    'motion_isolation' => 'Very Good',
                    'edge_support' => 'Excellent'
                )
            )
        ),
        'MLILY' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/mlily-logo.png',
            'rating' => 4.6,
            'warranty' => '10 years',
            'trial' => '120 nights',
            'expert_summary' => 'MLILY mattresses focus on advanced cooling technology for hot sleepers.',
            'accent_color' => '#1E4A76',
            'customer_rating_count' => 3400,
            'customer_comfort' => 4.5,
            'customer_support' => 4.6,
            'customer_cooling' => 4.8,
            'scores' => array('type_score' => 8, 'support_score' => 8, 'value_score' => 8, 'price_score' => 7, 'materials_score' => 8),
            'models' => array(
                array(
                    'name' => 'MLILY PowerCool',
                    'type' => 'Memory Foam',
                    'type_category' => 'foam',
                    'firmness' => 6,
                    'firmness_text' => 'Medium',
                    'price' => '$1,299 – $2,299',
                    'price_value' => 1699,
                    'best_for' => 'Hot sleepers, pressure relief',
                    'sleep_position' => json_encode(array('side', 'back')),
                    'key_features' => json_encode(array('Cooling Technology', 'Pressure Relief', 'Premium Foam')),
                    'tagline' => 'Advanced cooling for deeper sleep',
                    'cooling' => 'Cooling gel foam, breathable cover',
                    'motion_isolation' => 'Excellent',
                    'edge_support' => 'Very Good'
                ),
                array(
                    'name' => 'MLILY Firm',
                    'type' => 'Memory Foam',
                    'type_category' => 'foam',
                    'firmness' => 8,
                    'firmness_text' => 'Firm',
                    'price' => '$1,099 – $1,999',
                    'price_value' => 1399,
                    'best_for' => 'Stomach sleepers, firm preference',
                    'sleep_position' => json_encode(array('stomach', 'back')),
                    'key_features' => json_encode(array('Supportive', 'Durable', 'Value')),
                    'tagline' => 'Firm support for optimal alignment',
                    'cooling' => 'Gel-infused foam',
                    'motion_isolation' => 'Very Good',
                    'edge_support' => 'Good'
                )
            )
        ),
        'Nectar' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/nectar-logo.png',
            'rating' => 4.8,
            'warranty' => 'Lifetime',
            'trial' => '365 nights',
            'expert_summary' => 'Nectar offers premium memory foam comfort with an unbeatable 365-night trial.',
            'accent_color' => '#C41E3A',
            'customer_rating_count' => 89200,
            'customer_comfort' => 4.8,
            'customer_support' => 4.7,
            'customer_cooling' => 4.4,
            'scores' => array('type_score' => 8, 'support_score' => 8, 'value_score' => 9, 'price_score' => 9, 'materials_score' => 7),
            'models' => array(
                array(
                    'name' => 'Nectar Original',
                    'type' => 'Memory Foam',
                    'type_category' => 'foam',
                    'firmness' => 6.5,
                    'firmness_text' => 'Medium-Firm',
                    'price' => '$799 – $1,398',
                    'price_value' => 999,
                    'best_for' => 'Value seekers, back sleepers',
                    'sleep_position' => json_encode(array('back', 'stomach')),
                    'key_features' => json_encode(array('Gel Memory Foam', 'Lifetime Warranty', 'Affordable')),
                    'tagline' => 'The most comfortable mattress for the money',
                    'cooling' => 'Gel-infused memory foam',
                    'motion_isolation' => 'Excellent',
                    'edge_support' => 'Good'
                ),
                array(
                    'name' => 'Nectar Premier',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 6,
                    'firmness_text' => 'Medium',
                    'price' => '$1,299 – $1,999',
                    'price_value' => 1599,
                    'best_for' => 'All sleep positions, premium comfort',
                    'sleep_position' => json_encode(array('back', 'side', 'combination')),
                    'key_features' => json_encode(array('Cooling Cover', 'Premium Hybrid', 'Supportive')),
                    'tagline' => 'Upgraded cooling and support',
                    'cooling' => 'Phase change material cover',
                    'motion_isolation' => 'Very Good',
                    'edge_support' => 'Excellent'
                )
            )
        ),
        'Puffy' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/Puffy-logo.svg',
            'rating' => 4.7,
            'warranty' => 'Lifetime',
            'trial' => '101 nights',
            'expert_summary' => 'Puffy mattresses provide cloud-like comfort with advanced cooling technology.',
            'accent_color' => '#87CEEB',
            'customer_rating_count' => 45300,
            'customer_comfort' => 4.9,
            'customer_support' => 4.6,
            'customer_cooling' => 4.5,
            'scores' => array('type_score' => 8, 'support_score' => 8, 'value_score' => 8, 'price_score' => 7, 'materials_score' => 8),
            'models' => array(
                array(
                    'name' => 'Puffy Lux',
                    'type' => 'Memory Foam',
                    'type_category' => 'foam',
                    'firmness' => 5,
                    'firmness_text' => 'Medium-Soft',
                    'price' => '$1,149 – $1,949',
                    'price_value' => 1399,
                    'best_for' => 'Side sleepers, pressure relief',
                    'sleep_position' => json_encode(array('side')),
                    'key_features' => json_encode(array('Cooling Gel', 'Plush Feel', 'Pressure Relief')),
                    'tagline' => 'Luxuriously plush for side sleepers',
                    'cooling' => 'Cooling gel foam',
                    'motion_isolation' => 'Excellent',
                    'edge_support' => 'Good'
                ),
                array(
                    'name' => 'Puffy Royal',
                    'type' => 'Memory Foam',
                    'type_category' => 'foam',
                    'firmness' => 5.5,
                    'firmness_text' => 'Medium-Soft',
                    'price' => '$1,799 – $2,699',
                    'price_value' => 2099,
                    'best_for' => 'Luxury, all positions',
                    'sleep_position' => json_encode(array('back', 'side', 'combination')),
                    'key_features' => json_encode(array('Zoned Support', 'Advanced Cooling', 'Premium')),
                    'tagline' => 'The ultimate luxury memory foam',
                    'cooling' => 'Climate-regulating foam',
                    'motion_isolation' => 'Superior',
                    'edge_support' => 'Very Good'
                )
            )
        ),
        'WinkBeds' => array(
            'logo' => '/wp-content/uploads/sleepare/brands/winkbeds-logo.png',
            'rating' => 4.8,
            'warranty' => 'Lifetime',
            'trial' => '120 nights',
            'expert_summary' => 'WinkBeds offers luxury hybrid mattresses with zoned support and premium materials.',
            'accent_color' => '#B87333',
            'customer_rating_count' => 12400,
            'customer_comfort' => 4.7,
            'customer_support' => 4.9,
            'customer_cooling' => 4.5,
            'scores' => array('type_score' => 9, 'support_score' => 10, 'value_score' => 8, 'price_score' => 7, 'materials_score' => 9),
            'models' => array(
                array(
                    'name' => 'WinkBed',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 6,
                    'firmness_text' => 'Selectable',
                    'price' => '$1,299 – $2,199',
                    'price_value' => 1699,
                    'best_for' => 'All sleep positions',
                    'sleep_position' => json_encode(array('back', 'side', 'stomach', 'combination')),
                    'key_features' => json_encode(array('Zoned Support', 'Luxury Euro-top', 'Durable')),
                    'tagline' => 'The perfect balance of comfort and support',
                    'cooling' => 'Gel-infused foam, breathable cover',
                    'motion_isolation' => 'Good',
                    'edge_support' => 'Excellent'
                ),
                array(
                    'name' => 'WinkBed Plus',
                    'type' => 'Hybrid',
                    'type_category' => 'hybrid',
                    'firmness' => 8,
                    'firmness_text' => 'Firm',
                    'price' => '$1,399 – $2,299',
                    'price_value' => 1799,
                    'best_for' => 'Plus-size sleepers, heavy-duty support',
                    'sleep_position' => json_encode(array('back', 'stomach')),
                    'key_features' => json_encode(array('Extra Support', 'Durable Coils', 'Reinforced')),
                    'tagline' => 'Built for heavier bodies',
                    'cooling' => 'Gel foam, breathable design',
                    'motion_isolation' => 'Good',
                    'edge_support' => 'Superior'
                ),
                array(
                    'name' => 'Eco Cloud',
                    'type' => 'Natural Latex',
                    'type_category' => 'latex',
                    'firmness' => 6,
                    'firmness_text' => 'Medium',
                    'price' => '$1,199 – $2,099',
                    'price_value' => 1499,
                    'best_for' => 'Eco-conscious, responsive feel',
                    'sleep_position' => json_encode(array('back', 'side', 'combination')),
                    'key_features' => json_encode(array('Natural Latex', 'Organic Cotton', 'Sustainable')),
                    'tagline' => 'Naturally cool and responsive',
                    'cooling' => 'Natural latex, organic wool',
                    'motion_isolation' => 'Good',
                    'edge_support' => 'Very Good'
                )
            )
        )
    );
    
    $top_comparisons = array(
        array('brand1' => 'Casper', 'brand2' => 'Nectar'),
        array('brand1' => 'Helix', 'brand2' => 'Brooklyn Bedding'),
        array('brand1' => 'Avocado', 'brand2' => 'WinkBeds'),
        array('brand1' => 'Bear', 'brand2' => 'GhostBed'),
        array('brand1' => 'DreamCloud', 'brand2' => 'Puffy'),
        array('brand1' => 'Leesa', 'brand2' => 'MLILY'),
        array('brand1' => 'Casper', 'brand2' => 'Helix'),
        array('brand1' => 'Nectar', 'brand2' => 'DreamCloud')
    );
    
    foreach ($default_data as $brand_name => $data) {
        // Insert brand
        $wpdb->insert(
            SP_MATTRESS_BRANDS,
            array(
                'name' => $brand_name,
                'logo' => $data['logo'],
                'rating' => $data['rating'],
                'warranty' => $data['warranty'],
                'trial' => $data['trial'],
                'expert_summary' => $data['expert_summary'],
                'accent_color' => $data['accent_color'],
                'customer_rating_count' => $data['customer_rating_count'],
                'customer_comfort' => $data['customer_comfort'],
                'customer_support' => $data['customer_support'],
                'customer_cooling' => $data['customer_cooling']
            )
        );
        
        $brand_id = $wpdb->insert_id;
        
        // Insert scores
        $wpdb->insert(
            SP_EXPERT_SCORES,
            array_merge(array('brand_id' => $brand_id), $data['scores'])
        );
        
        // Insert models
        foreach ($data['models'] as $model) {
            $wpdb->insert(
                SP_MATTRESS_MODELS,
                array_merge(array('brand_id' => $brand_id), $model)
            );
        }
    }
    
    // Save top comparisons as option
    update_option('sp_top_comparisons', $top_comparisons);
}

// ============================================
// REST API ENDPOINTS
// ============================================
add_action('rest_api_init', function () {
    // GET endpoint for all mattress data
    register_rest_route('sleepare/v1', '/mattresses', array(
        'methods' => 'GET',
        'callback' => 'sp_get_mattresses',
        'permission_callback' => '__return_true'
    ));
    
    // POST endpoint for saving/updating mattress data
    register_rest_route('sleepare/v1', '/mattresses', array(
        'methods' => 'POST',
        'callback' => 'sp_save_mattress',
        'permission_callback' => 'sp_check_admin_permission'
    ));
    
    // DELETE endpoint for removing a brand
    register_rest_route('sleepare/v1', '/mattresses/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'sp_delete_mattress',
        'permission_callback' => 'sp_check_admin_permission'
    ));
});

function sp_check_admin_permission() {
    return current_user_can('manage_options');
}

function sp_get_mattresses() {
    global $wpdb;
    
    $brands_table = SP_MATTRESS_BRANDS;
    $models_table = SP_MATTRESS_MODELS;
    $scores_table = SP_EXPERT_SCORES;
    
    $brands = $wpdb->get_results("SELECT * FROM $brands_table ORDER BY name", ARRAY_A);
    $mattresses = array();
    
    foreach ($brands as $brand) {
        $brand_id = $brand['id'];
        
        // Get models
        $models = $wpdb->get_results("
            SELECT * FROM $models_table 
            WHERE brand_id = $brand_id 
            ORDER BY id
        ", ARRAY_A);
        
        // Parse JSON fields in models
        foreach ($models as &$model) {
            $model['sleep_position'] = json_decode($model['sleep_position'], true) ?: array();
            $model['key_features'] = json_decode($model['key_features'], true) ?: array();
        }
        
        // Get scores
        $scores = $wpdb->get_row("
            SELECT * FROM $scores_table 
            WHERE brand_id = $brand_id
        ", ARRAY_A);
        
        $mattresses[$brand['name']] = array(
            'logo' => $brand['logo'],
            'models' => $models,
            'rating' => floatval($brand['rating']),
            'warranty' => $brand['warranty'],
            'trial' => $brand['trial'],
            'expertSummary' => $brand['expert_summary'],
            'accentColor' => $brand['accent_color'],
            'customerRatingCount' => intval($brand['customer_rating_count']),
            'customerComfort' => floatval($brand['customer_comfort']),
            'customerSupport' => floatval($brand['customer_support']),
            'customerCooling' => floatval($brand['customer_cooling']),
            'scores' => array(
                'type' => intval($scores['type_score']),
                'support' => intval($scores['support_score']),
                'value' => intval($scores['value_score']),
                'price' => intval($scores['price_score']),
                'materials' => intval($scores['materials_score'])
            )
        );
    }
    
    $top_comparisons = get_option('sp_top_comparisons', array());
    
    return array(
        'mattresses' => $mattresses,
        'topComparisons' => $top_comparisons
    );
}

function sp_save_mattress($request) {
    global $wpdb;
    
    $params = $request->get_json_params();
    $brand_name = sanitize_text_field($params['brandName']);
    $data = $params['data'];
    
    $brands_table = SP_MATTRESS_BRANDS;
    $models_table = SP_MATTRESS_MODELS;
    $scores_table = SP_EXPERT_SCORES;
    
    // Check if brand exists
    $existing = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM $brands_table WHERE name = %s",
        $brand_name
    ));
    
    if ($existing) {
        // Update existing brand
        $wpdb->update(
            $brands_table,
            array(
                'logo' => $data['logo'],
                'rating' => $data['rating'],
                'warranty' => $data['warranty'],
                'trial' => $data['trial'],
                'expert_summary' => $data['expertSummary'],
                'accent_color' => $data['accentColor'],
                'customer_rating_count' => $data['customerRatingCount'],
                'customer_comfort' => $data['customerComfort'],
                'customer_support' => $data['customerSupport'],
                'customer_cooling' => $data['customerCooling']
            ),
            array('id' => $existing)
        );
        $brand_id = $existing;
        
        // Update scores
        $wpdb->update(
            $scores_table,
            array(
                'type_score' => $data['scores']['type'],
                'support_score' => $data['scores']['support'],
                'value_score' => $data['scores']['value'],
                'price_score' => $data['scores']['price'],
                'materials_score' => $data['scores']['materials']
            ),
            array('brand_id' => $brand_id)
        );
        
        // Delete existing models
        $wpdb->delete($models_table, array('brand_id' => $brand_id));
        
    } else {
        // Insert new brand
        $wpdb->insert(
            $brands_table,
            array(
                'name' => $brand_name,
                'logo' => $data['logo'],
                'rating' => $data['rating'],
                'warranty' => $data['warranty'],
                'trial' => $data['trial'],
                'expert_summary' => $data['expertSummary'],
                'accent_color' => $data['accentColor'],
                'customer_rating_count' => $data['customerRatingCount'],
                'customer_comfort' => $data['customerComfort'],
                'customer_support' => $data['customerSupport'],
                'customer_cooling' => $data['customerCooling']
            )
        );
        $brand_id = $wpdb->insert_id;
        
        // Insert scores
        $wpdb->insert(
            $scores_table,
            array(
                'brand_id' => $brand_id,
                'type_score' => $data['scores']['type'],
                'support_score' => $data['scores']['support'],
                'value_score' => $data['scores']['value'],
                'price_score' => $data['scores']['price'],
                'materials_score' => $data['scores']['materials']
            )
        );
    }
    
    // Insert models
    foreach ($data['models'] as $model) {
        $wpdb->insert(
            $models_table,
            array(
                'brand_id' => $brand_id,
                'name' => $model['name'],
                'type' => $model['type'],
                'type_category' => $model['typeCategory'],
                'firmness' => $model['firmness'],
                'firmness_text' => $model['firmnessText'],
                'price' => $model['price'],
                'price_value' => $model['priceValue'],
                'best_for' => $model['bestFor'],
                'sleep_position' => json_encode($model['sleepPosition']),
                'key_features' => json_encode($model['keyFeatures']),
                'tagline' => $model['tagline'],
                'cooling' => $model['cooling'],
                'motion_isolation' => $model['motionIsolation'],
                'edge_support' => $model['edgeSupport']
            )
        );
    }
    
    return array('success' => true, 'message' => 'Saved successfully');
}

function sp_delete_mattress($request) {
    global $wpdb;
    
    $id = intval($request['id']);
    $brands_table = SP_MATTRESS_BRANDS;
    
    $result = $wpdb->delete($brands_table, array('id' => $id));
    
    return array('success' => $result > 0);
}

// ============================================
// CREATE PAGES ON THEME ACTIVATION
// ============================================
function sp_create_pages() {
    $pages = array(
        'comparison-tool' => 'Mattress Comparison Tool',
        'admin-panel' => 'Mattress Admin Panel',
        'detailed-comparison' => 'Detailed Mattress Comparison'
    );
    
    foreach ($pages as $slug => $title) {
        $page = get_page_by_path($slug);
        if (!$page) {
            wp_insert_post(array(
                'post_title' => $title,
                'post_name' => $slug,
                'post_content' => "[$slug]",
                'post_status' => 'publish',
                'post_type' => 'page'
            ));
        }
    }
}
add_action('after_switch_theme', 'sp_create_pages');

// ============================================
// SHORTCODES
// ============================================

// Comparison Tool Shortcode
add_shortcode('comparison-tool', 'sp_comparison_tool_shortcode');
function sp_comparison_tool_shortcode() {
    ob_start();
    ?>
    <div class="sleepare-container">
        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <div class="hero-grid">
                    <div class="hero-content">
                        <div class="hero-badge"><span>Try Before You Buy</span></div>
                        <h1>Compare Mattresses<br>Side by Side. Find Your<br>Perfect Match.</h1>
                        <p>Stop guessing. Test premium online mattresses in-store and compare top brands with our interactive tool.</p>
                        <div class="hero-buttons">
                            <a href="https://www.sleepare.com/mattress-stores/" class="btn-primary" target="_blank">Find a Store</a>
                            <a href="https://www.sleepare.com/shop/" class="btn-outline" target="_blank">Shop Online</a>
                        </div>
                        <div class="stats-grid">
                            <div class="stat-google">
                                <img src="/wp-content/themes/sleepare-child/assets/images/google-logo.png" alt="Google" class="google-logo" onerror="this.style.display='none'">
                                <div>
                                    <div class="stat-number">4.9</div>
                                    <div class="stars">★★★★★</div>
                                    <div class="stat-detail">6,240+ reviews</div>
                                </div>
                            </div>
                            <div>
                                <div class="stat-number">50,000+</div>
                                <div class="stat-label">Happy Sleepers</div>
                                <div class="stat-detail">Trusted nationwide</div>
                            </div>
                            <div>
                                <div class="stat-number">15+</div>
                                <div class="stat-label">Top Brands</div>
                                <div class="stat-detail">Available in-store</div>
                            </div>
                            <div>
                                <div class="stat-number">120</div>
                                <div class="stat-label">Night Trial</div>
                                <div class="stat-detail">Risk-free testing</div>
                            </div>
                        </div>
                    </div>
                    <div class="hero-image">
                        <div class="image-placeholder">
                            <img src="/wp-content/themes/sleepare-child/assets/images/Image1-banner-img.svg" alt="SleePare showroom" style="width: 100%; border-radius: 16px;" onerror="this.style.display='none'">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div class="section-tag purple">Interactive Tool</div>
                    <h2>Compare Any Two Mattresses</h2>
                    <p>Select two mattresses below to see how they compare.</p>
                </div>

                <div class="filter-bar">
                    <div class="filter-group-simple">
                        <label>Sleep Position</label>
                        <select id="sleepPositionSelect" class="simple-select">
                            <option value="all">All Sleepers</option>
                            <option value="back">Back Sleepers</option>
                            <option value="side">Side Sleepers</option>
                            <option value="stomach">Stomach Sleepers</option>
                            <option value="combination">Combination Sleepers</option>
                        </select>
                    </div>
                    <div class="filter-group-simple">
                        <label>Mattress Type</label>
                        <select id="typeSelect" class="simple-select">
                            <option value="all">All Types</option>
                            <option value="memory foam">Memory Foam</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="latex">Latex</option>
                        </select>
                    </div>
                    <div class="filter-group-simple">
                        <label>Budget</label>
                        <select id="budgetSelect" class="simple-select">
                            <option value="all">Any Budget</option>
                            <option value="under1000">Under $1,000</option>
                            <option value="1000-2000">$1,000 - $2,000</option>
                            <option value="over2000">Over $2,000</option>
                        </select>
                    </div>
                    <button id="resetFiltersSimple" class="btn-reset-simple">Reset</button>
                </div>

                <div class="comparison-layout">
                    <div class="mattress-cards-panel">
                        <h3>Select Mattresses</h3>
                        <div class="mattress-grid" id="mattressGrid"></div>
                    </div>
                    <div class="comparison-panel">
                        <div class="comparison-panel-header">
                            <h3>Comparison</h3>
                            <button id="swapCompact" class="btn-swap-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M16 3L20 7L16 11M4 7H20M8 21L4 17L8 13M20 17H4" />
                                </svg>
                            </button>
                        </div>
                        <div class="comparison-slots-compact">
                            <div class="compact-slot" id="compactSlotA">
                                <div class="compact-slot-empty">Select a mattress to compare</div>
                            </div>
                            <div class="compact-vs">VS</div>
                            <div class="compact-slot" id="compactSlotB">
                                <div class="compact-slot-empty">Select a mattress to compare</div>
                            </div>
                        </div>
                        <div class="deep-comparison-container" id="deepComparisonContainer" style="display: none;">
                            <a href="#" class="btn-primary btn-deep-comparison" id="deepComparisonBtn">View Detailed Comparison →</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div class="section-tag purple">Our Methodology</div>
                    <h2>The 5 Elements of Mattress Comparisons</h2>
                    <p>Click any card to learn more. We rate every mattress based on these five core factors.</p>
                </div>
                <div class="elements-grid">
                    <div class="element-card" data-element="materials">
                        <div class="element-icon" style="background-image: url('/wp-content/themes/sleepare-child/assets/images/Material.svg');"></div>
                        <h3>Materials</h3>
                        <p>The type of mattress and what it's made from</p>
                        <div class="element-hint">Click to learn more →</div>
                    </div>
                    <div class="element-card" data-element="brand">
                        <div class="element-icon" style="background-image: url('/wp-content/themes/sleepare-child/assets/images/Brand.svg');"></div>
                        <h3>Brand & Reputation</h3>
                        <p>Quality, warranty, trial period, and return policy</p>
                        <div class="element-hint">Click to learn more →</div>
                    </div>
                    <div class="element-card" data-element="bodyType">
                        <div class="element-icon" style="background-image: url('/wp-content/themes/sleepare-child/assets/images/Body-Type.svg');"></div>
                        <h3>Body Type Suitability</h3>
                        <p>Support and pressure distribution for your build</p>
                        <div class="element-hint">Click to learn more →</div>
                    </div>
                    <div class="element-card" data-element="couples">
                        <div class="element-icon" style="background-image: url('/wp-content/themes/sleepare-child/assets/images/Couple.svg');"></div>
                        <h3>Couples Adjustability</h3>
                        <p>Edge support, motion isolation, and dual comfort options for partners</p>
                        <div class="element-hint">Click to learn more →</div>
                    </div>
                    <div class="element-card" data-element="price">
                        <div class="element-icon" style="background-image: url('/wp-content/themes/sleepare-child/assets/images/Price.svg');"></div>
                        <h3>Price & Value</h3>
                        <p>Quality features without paying for what you don't need</p>
                        <div class="element-hint">Click to learn more →</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div class="section-tag purple">Popular Comparisons</div>
                    <h2>Top-Rated Mattress Comparisons</h2>
                    <p>Click any comparison to load it above.</p>
                </div>
                <div class="comparisons-grid" id="comparisonsGrid"></div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <div class="faq-grid">
                    <div>
                        <div class="section-tag purple">Common Questions</div>
                        <h2>Frequently Asked Questions</h2>
                        <p>Everything you need to know about finding your perfect mattress.</p>
                    </div>
                    <div class="faq-list">
                        <div class="faq-item">
                            <div class="faq-question">What is the best type of mattress? <span class="faq-icon">+</span></div>
                            <div class="faq-answer">There's no single "best" mattress for everyone. Most people tend to prefer memory foam or hybrid mattresses based on their sleep position and comfort preferences. The best way to know is to test them in person at a SleePare showroom.</div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">What mattress do you recommend for back problems? <span class="faq-icon">+</span></div>
                            <div class="faq-answer">The best mattresses for back problems depend on the location of your pain and your primary sleep position. According to chiropractors, the Saatva is a top choice for back pain. Approved by the Congress of Chiropractic State Associations, the Saatva is a hybrid mattress designed for enhanced lumbar support and spinal alignment. We recommend consulting with your doctor and testing mattresses in person to find the right fit.</div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">What is an organic mattress made of? <span class="faq-icon">+</span></div>
                            <div class="faq-answer">Organic mattresses are made from sustainable materials like organic cotton and wool. They do not contain VOCs (volatile organic compounds), which are harmful chemicals found in some synthetic foam mattresses that can cause allergies and skin irritation. SleePare carries many of the newest organic mattresses from top brands.</div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">What is a bed-in-a-box? <span class="faq-icon">+</span></div>
                            <div class="faq-answer">A "bed-in-a-box" is a mattress that is compressed, rolled, and shipped in a compact box directly to your door. Online mattress companies popularized this concept with advanced foam materials that expand once unpacked. SleePare carries both bed-in-a-box and traditional mattresses, so you can test them in person before buying.</div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">What is the best mattress for hot sleepers? <span class="faq-icon">+</span></div>
                            <div class="faq-answer">Hot sleepers should look for mattresses with cooling technologies like gel-infused memory foam, breathable covers, or hybrid designs that promote airflow. SleePare has compiled a list of the best mattresses for hot sleepers, with the Helix Birch as our top recommendation for its natural cooling properties.</div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">How do I dispose of my old mattress? <span class="faq-icon">+</span></div>
                            <div class="faq-answer">Disposal regulations vary by city and state. Before discarding your old mattress, check with your local waste management authority for guidelines. Many mattress retailers, including SleePare, offer removal services when you purchase a new mattress.</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="cta-banner">
            <div class="container">
                <div class="cta-content">
                    <h3>Experience it yourself</h3>
                    <p>Visit any SleePare showroom to test top brands side-by-side</p>
                    <a href="https://www.sleepare.com/mattress-stores/" class="btn-primary" target="_blank">Find a Store Near You</a>
                </div>
            </div>
        </section>

        <div id="mattressModal" class="modal">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <div id="modalContent"></div>
            </div>
        </div>
    </div>
    
    <style>
        <?php echo sp_get_comparison_css(); ?>
    </style>
    
    <script>
        <?php echo sp_get_comparison_js(); ?>
    </script>
    <?php
    return ob_get_clean();
}

// Admin Panel Shortcode
add_shortcode('admin-panel', 'sp_admin_panel_shortcode');
function sp_admin_panel_shortcode() {
    if (!current_user_can('manage_options')) {
        return '<p>You do not have permission to access this page.</p>';
    }
    
    ob_start();
    ?>
    <div class="admin-container">
        <div class="admin-header">
            <h1>Mattress Management</h1>
            <div style="display: flex; gap: 12px;">
                <a href="/" class="btn-outline" style="text-decoration: none;">← Back to Site</a>
                <button id="refreshDataBtn" class="btn-outline">⟳ Refresh</button>
            </div>
        </div>
        
        <div id="statusMessage" class="status-message"></div>
        
        <div class="admin-tabs">
            <button class="admin-tab active" data-tab="edit">Edit Mattresses</button>
            <button class="admin-tab" data-tab="add">Add Mattress</button>
            <button class="admin-tab" data-tab="export">Export / Import</button>
            <button class="admin-tab" data-tab="brands">All Brands</button>
        </div>
        
        <!-- Edit Panel -->
        <div class="admin-panel active" id="editPanel">
            <div class="mattress-editor">
                <h3>Select a mattress to edit</h3>
                <select id="brandSelect">
                    <option value="">-- Select a mattress brand --</option>
                </select>
                <div id="editFormContainer" style="display: none;"></div>
            </div>
        </div>
        
        <!-- Add Panel -->
        <div class="admin-panel" id="addPanel">
            <div class="mattress-editor">
                <h3>Add new mattress brand</h3>
                <div id="addFormContainer"></div>
            </div>
        </div>
        
        <!-- Export Panel -->
        <div class="admin-panel" id="exportPanel">
            <div class="mattress-editor">
                <h3>Export data</h3>
                <p>Download all mattress data as a JSON file. This file can be used for backup or imported into WordPress.</p>
                <button id="exportBtn" class="btn-primary">📥 Download mattresses.json</button>
                
                <div class="import-section">
                    <h3>Import data</h3>
                    <p>Import a previously exported JSON file to restore or update mattress data.</p>
                    <input type="file" id="importFile" accept=".json">
                    <button id="importBtn" class="btn-primary" style="margin-top: 16px;">📤 Import JSON</button>
                </div>
                
                <h3 style="margin-top: 32px;">Current data preview</h3>
                <div class="json-preview-container">
                    <div class="json-preview-header">
                        <span>📄 mattresses.json</span>
                        <button id="copyJsonBtn">Copy</button>
                    </div>
                    <pre id="jsonPreview" class="json-preview">Loading data...</pre>
                </div>
            </div>
        </div>
        
        <!-- Brands Panel -->
        <div class="admin-panel" id="brandsPanel">
            <div class="mattress-editor">
                <h3>All mattress brands</h3>
                <p>Click any brand to view full details. Use the buttons to edit or delete.</p>
                <div id="brandsListContainer"></div>
            </div>
        </div>
    </div>
    
    <!-- Modal for Viewing Brand Details -->
    <div id="brandModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle">Brand Details</h2>
                <div class="modal-actions">
                    <button id="modalEditBtn" class="btn-outline" style="padding: 6px 16px;">✏️ Edit</button>
                    <button id="modalDeleteBtn" class="btn-danger" style="padding: 6px 16px;">🗑️ Delete</button>
                    <span class="modal-close">&times;</span>
                </div>
            </div>
            <div class="modal-body" id="modalBody">
                Loading...
            </div>
        </div>
    </div>
    
    <style>
        <?php echo sp_get_admin_css(); ?>
    </style>
    
    <script>
        <?php echo sp_get_admin_js(); ?>
    </script>
    <?php
    return ob_get_clean();
}

// Detailed Comparison Shortcode
add_shortcode('detailed-comparison', 'sp_detailed_comparison_shortcode');
function sp_detailed_comparison_shortcode() {
    ob_start();
    ?>
    <div class="comparison-container">
        <div style="padding: 24px 0 0 0; margin-bottom: 24px;">
            <a href="/comparison-tool/" id="backLink" style="display: inline-flex; align-items: center; gap: 8px; color: var(--heading-color); text-decoration: none; font-weight: 600; font-size: 14px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18L9 12L15 6"/></svg>
                Back to Comparison Tool
            </a>
        </div>

        <div id="comparisonContent">
            <div class="error-message">
                <div class="section-tag purple">Loading</div>
                <h2>Loading comparison data...</h2>
            </div>
        </div>
    </div>

    <a href="/comparison-tool/" class="floating-back-btn" id="floatingBackBtn" aria-label="Back">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 12H5M12 19L5 12L12 5"/></svg>
    </a>

    <div id="mattressModal" class="modal">
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div id="modalContent"></div>
        </div>
    </div>
    
    <style>
        <?php echo sp_get_detailed_css(); ?>
    </style>
    
    <script>
        <?php echo sp_get_detailed_js(); ?>
    </script>
    <?php
    return ob_get_clean();
}

// ============================================
// ENQUEUE ASSETS
// ============================================
function sp_enqueue_assets() {
    // Only load on pages with our shortcodes
    if (is_page('comparison-tool') || is_page('admin-panel') || is_page('detailed-comparison')) {
        wp_enqueue_style('sp-styles', get_stylesheet_directory_uri() . '/style.css', array(), '1.0');
        
        // Enqueue data.js
        wp_enqueue_script('sp-data', get_stylesheet_directory_uri() . '/js/data.js', array(), '1.0', true);
        
        // Pass REST API URL to scripts
        wp_localize_script('sp-data', 'spApi', array(
            'root' => esc_url_raw(rest_url()),
            'nonce' => wp_create_nonce('wp_rest')
        ));
    }
}
add_action('wp_enqueue_scripts', 'sp_enqueue_assets');

// ============================================
// INLINE CSS FUNCTIONS
// ============================================
function sp_get_comparison_css() {
    ob_start();
    ?>
    :root {
        --heading-color: #11173C;
        --body-color: #2c3e50;
        --white: #FFFFFF;
        --primary: #5E00FF;
        --accent-blue: #2C5F8A;
        --border-light: #eef2f5;
        --bg-light: #fafbff;
    }
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: 'Work Sans', sans-serif;
        background: var(--white);
    }
    
    .sleepare-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 32px;
    }
    
    .hero {
        padding: 60px 0;
        background: linear-gradient(135deg, #f8f9ff 0%, var(--white) 100%);
    }
    
    .hero-grid {
        display: grid;
        grid-template-columns: 1fr 0.9fr;
        gap: 60px;
        align-items: center;
    }
    
    .hero-badge span {
        background: linear-gradient(135deg, #5E00FF 0%, #C800FF 100%);
        color: white;
        font-weight: 600;
        font-size: 13px;
        padding: 6px 16px;
        border-radius: 30px;
        display: inline-block;
    }
    
    .hero-content h1 {
        font-size: 48px;
        margin: 20px 0;
        color: var(--heading-color);
    }
    
    .hero-content p {
        font-size: 18px;
        color: #5a6874;
        margin-bottom: 32px;
    }
    
    .hero-buttons {
        display: flex;
        gap: 16px;
        margin-bottom: 48px;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #5E00FF 0%, #C800FF 100%);
        color: var(--white);
        font-family: 'Work Sans', sans-serif;
        font-weight: 600;
        border-radius: 12px;
        height: 48px;
        padding: 0 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        text-decoration: none;
        font-size: 14px;
        border: none;
    }
    
    .btn-outline {
        background: transparent;
        border: 1.5px solid var(--accent-blue);
        color: var(--accent-blue);
        font-family: 'Work Sans', sans-serif;
        font-weight: 600;
        border-radius: 12px;
        height: 48px;
        padding: 0 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        text-decoration: none;
        font-size: 14px;
    }
    
    .btn-outline:hover {
        background: var(--accent-blue);
        color: var(--white);
        border-color: var(--accent-blue);
    }
    
    .stats-grid {
        display: flex;
        flex-wrap: nowrap;
        gap: 48px;
        align-items: flex-start;
        overflow-x: auto;
    }
    
    .stat-google {
        display: flex;
        align-items: flex-start;
        gap: 16px;
    }
    
    .google-logo {
        width: 50px;
        height: auto;
        object-fit: contain;
    }
    
    .stat-number {
        font-size: 32px;
        font-weight: 800;
        color: var(--heading-color);
        line-height: 1;
    }
    
    .stars {
        color: #FFB800;
        font-size: 16px;
        letter-spacing: 2px;
    }
    
    .stat-label {
        font-size: 14px;
        font-weight: 600;
        color: #5a6874;
    }
    
    .stat-detail {
        font-size: 12px;
        color: #8e9aab;
    }
    
    .hero-image .image-placeholder {
        background-color: var(--bg-light);
        padding: 48px;
        text-align: center;
        border-radius: 16px;
    }
    
    .section {
        padding: 60px 0;
    }
    
    .section-header {
        text-align: center;
        max-width: 700px;
        margin: 0 auto 48px auto;
    }
    
    .section-tag {
        display: inline-block;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        background: rgba(44, 95, 138, 0.1);
        color: var(--accent-blue);
        padding: 4px 12px;
        border-radius: 20px;
        margin-bottom: 16px;
    }
    
    .section-tag.purple {
        background: rgba(94, 0, 255, 0.1);
        color: var(--primary);
    }
    
    .section-header h2 {
        font-size: 32px;
        color: var(--heading-color);
        margin-bottom: 16px;
    }
    
    .section-header p {
        font-size: 18px;
        color: #5a6874;
    }
    
    .filter-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
        margin-bottom: 32px;
        padding: 12px 20px;
        background: var(--white);
        border-radius: 48px;
        border: 1px solid var(--border-light);
    }
    
    .filter-group-simple {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .filter-group-simple label {
        font-weight: 500;
        font-size: 13px;
        color: var(--heading-color);
    }
    
    .simple-select {
        padding: 6px 12px;
        border-radius: 30px;
        border: 1px solid var(--border-light);
        font-family: 'Work Sans', sans-serif;
        font-size: 13px;
        background: white;
        cursor: pointer;
    }
    
    .btn-reset-simple {
        background: transparent;
        border: 1px solid var(--border-light);
        padding: 6px 16px;
        border-radius: 30px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        font-family: 'Work Sans', sans-serif;
        color: var(--body-color);
    }
    
    .comparison-layout {
        display: grid;
        grid-template-columns: 1fr 0.85fr;
        gap: 32px;
        align-items: start;
    }
    
    .mattress-cards-panel h3 {
        margin-bottom: 20px;
    }
    
    .mattress-grid {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 560px;
        overflow-y: auto;
        padding-right: 8px;
    }
    
    .mattress-card {
        background: var(--white);
        border-radius: 14px;
        padding: 12px 16px;
        border: 1px solid var(--border-light);
        transition: all 0.2s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .mattress-card:hover {
        transform: translateX(2px);
        border-color: var(--accent-blue);
    }
    
    .mattress-card.selected-a {
        border-left: 3px solid var(--primary);
    }
    
    .mattress-card.selected-b {
        border-right: 3px solid var(--accent-blue);
    }
    
    .brand-logo {
        width: 80px;
        height: auto;
        max-height: 28px;
        object-fit: contain;
        object-position: left;
    }
    
    .mattress-card-info {
        flex: 1;
    }
    
    .mattress-card-info .model-name {
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 2px;
    }
    
    .mattress-card-info p {
        font-size: 11px;
        color: #8e9aab;
    }
    
    .mattress-card-price {
        font-weight: 600;
        color: var(--heading-color);
        font-size: 13px;
    }
    
    .mattress-card-actions {
        display: flex;
        gap: 6px;
    }
    
    .btn-card-compare {
        background: var(--accent-blue);
        color: white;
        border: none;
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        font-family: 'Work Sans', sans-serif;
    }
    
    .btn-card-details {
        background: transparent;
        border: 1px solid var(--border-light);
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        font-family: 'Work Sans', sans-serif;
        color: var(--body-color);
    }
    
    .comparison-panel {
        background: var(--bg-light);
        border-radius: 24px;
        padding: 20px;
        position: sticky;
        top: 20px;
        border: 1px solid var(--border-light);
    }
    
    .comparison-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    
    .btn-swap-icon {
        background: transparent;
        border: 1px solid var(--border-light);
        border-radius: 40px;
        width: 32px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--body-color);
    }
    
    .comparison-slots-compact {
        display: flex;
        align-items: stretch;
        gap: 20px;
        margin-bottom: 20px;
    }
    
    .compact-slot {
        flex: 1;
        background: var(--white);
        border-radius: 20px;
        padding: 16px;
        min-height: 280px;
        border: 2px dashed var(--border-light);
        display: flex;
        flex-direction: column;
    }
    
    .compact-slot.filled {
        border: 2px solid rgba(44, 95, 138, 0.3);
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    
    .compact-slot-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #adb5bd;
        font-size: 12px;
    }
    
    .compact-slot-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-light);
    }
    
    .brand-logo-compact {
        width: 80px;
        height: auto;
        max-height: 32px;
        object-fit: contain;
        object-position: left;
    }
    
    .remove-slot {
        background: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #adb5bd;
        padding: 0 4px;
        line-height: 1;
    }
    
    .remove-slot:hover {
        color: #dc3545;
    }
    
    .compact-feature-list {
        list-style: none;
        font-size: 12px;
        margin-top: 12px;
    }
    
    .compact-feature-list li {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid var(--border-light);
    }
    
    .compact-vs {
        font-size: 20px;
        font-weight: 800;
        color: var(--primary);
        background: rgba(94, 0, 255, 0.1);
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }
    
    .btn-deep-comparison {
        width: 100%;
        background: var(--accent-blue);
        color: white;
        font-size: 14px;
        font-weight: 600;
        border-radius: 12px;
        height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        text-decoration: none;
        border: none;
        cursor: pointer;
        margin-top: 20px;
        font-family: 'Work Sans', sans-serif;
    }
    
    .elements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 24px;
    }
    
    .element-card {
        background: var(--white);
        border-radius: 20px;
        padding: 28px 20px;
        text-align: center;
        transition: all 0.2s ease;
        border: 1px solid var(--border-light);
        cursor: pointer;
    }
    
    .element-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    
    .element-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 16px auto;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }
    
    .element-card h3 {
        font-size: 20px;
        margin-bottom: 12px;
    }
    
    .element-card p {
        font-size: 14px;
        color: #5a6874;
    }
    
    .element-hint {
        font-size: 11px;
        color: var(--accent-blue);
        margin-top: 12px;
        opacity: 0.7;
    }
    
    .comparisons-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;
    }
    
    .comparison-tag {
        background: var(--white);
        padding: 12px 20px;
        border-radius: 60px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid var(--border-light);
        display: inline-flex;
        align-items: center;
        gap: 12px;
    }
    
    .comparison-tag:hover {
        transform: scale(1.02);
        border-color: var(--accent-blue);
    }
    
    .brand-logo-tag {
        width: 32px;
        height: auto;
        max-height: 24px;
        object-fit: contain;
    }
    
    .comparison-tag .vs-text {
        font-weight: 800;
        color: var(--primary);
        background: rgba(94, 0, 255, 0.1);
        padding: 4px 12px;
        border-radius: 40px;
        font-size: 14px;
    }
    
    .faq-grid {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 48px;
    }
    
    .faq-item {
        border-bottom: 1px solid var(--border-light);
        margin-bottom: 0;
    }
    
    .faq-question {
        font-weight: 600;
        font-size: 16px;
        padding: 16px 0;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .faq-icon {
        font-size: 20px;
        color: var(--accent-blue);
        transition: transform 0.2s ease;
    }
    
    .faq-item.active .faq-icon {
        transform: rotate(45deg);
    }
    
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.25s ease-out;
        color: #5a6874;
        font-size: 14px;
        line-height: 1.6;
    }
    
    .faq-item.active .faq-answer {
        padding-bottom: 16px;
    }
    
    .cta-banner {
        background: var(--heading-color);
        padding: 40px 0;
        text-align: center;
    }
    
    .cta-content h3 {
        color: white;
        font-size: 24px;
        margin-bottom: 12px;
    }
    
    .cta-content p {
        color: rgba(255, 255, 255, 0.8);
        max-width: 500px;
        margin: 0 auto 20px;
        font-size: 14px;
    }
    
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
    }
    
    .modal-content {
        background: white;
        margin: 5% auto;
        width: 90%;
        max-width: 600px;
        border-radius: 24px;
        max-height: 85vh;
        overflow-y: auto;
    }
    
    .modal-close {
        float: right;
        font-size: 24px;
        cursor: pointer;
        padding: 16px;
    }
    
    #modalContent {
        padding: 0 24px 32px;
        clear: both;
    }
    
    .model-selector {
        display: flex;
        gap: 6px;
        margin: 6px 0;
        flex-wrap: wrap;
    }
    
    .model-badge {
        background: var(--bg-light);
        padding: 3px 8px;
        border-radius: 16px;
        font-size: 10px;
        font-weight: 500;
        color: var(--accent-blue);
        border: 1px solid var(--border-light);
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .model-badge.active {
        background: linear-gradient(135deg, #5E00FF 0%, #C800FF 100%);
        color: white;
        border-color: transparent;
    }
    
    .floating-back-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: linear-gradient(135deg, #5E00FF 0%, #C800FF 100%);
        color: white;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        z-index: 100;
    }
    
    @media (max-width: 1024px) {
        .comparison-layout {
            grid-template-columns: 1fr;
        }
        .comparison-panel {
            position: static;
        }
    }
    
    @media (max-width: 768px) {
        .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
        }
        .hero-buttons {
            justify-content: center;
        }
        .stats-grid {
            justify-content: center;
            flex-wrap: wrap;
        }
        .filter-bar {
            flex-direction: column;
            border-radius: 24px;
        }
        .comparison-slots-compact {
            flex-direction: column;
        }
        .compact-vs {
            align-self: center;
        }
        .faq-grid {
            grid-template-columns: 1fr;
        }
        .sleepare-container {
            padding: 0 20px;
        }
        .section {
            padding: 40px 0;
        }
        h1 {
            font-size: 32px;
        }
        h2 {
            font-size: 24px;
        }
    }
    <?php
    return ob_get_clean();
}

function sp_get_admin_css() {
    ob_start();
    ?>
    .admin-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 24px;
    }
    
    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eef2f5;
        flex-wrap: wrap;
        gap: 16px;
    }
    
    .admin-header h1 {
        font-size: 28px;
        margin: 0;
        color: #11173C;
    }
    
    .admin-tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 32px;
        border-bottom: 1px solid #eef2f5;
    }
    
    .admin-tab {
        padding: 10px 20px;
        background: transparent;
        border: none;
        font-family: 'Work Sans', sans-serif;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        color: #5a6874;
        border-radius: 8px 8px 0 0;
    }
    
    .admin-tab.active {
        color: #2C5F8A;
        border-bottom: 2px solid #2C5F8A;
        font-weight: 600;
    }
    
    .admin-panel {
        display: none;
    }
    
    .admin-panel.active {
        display: block;
    }
    
    .mattress-editor {
        background: white;
        border-radius: 16px;
        padding: 28px;
        margin-bottom: 32px;
        border: 1px solid #eef2f5;
    }
    
    .status-message {
        padding: 12px 20px;
        border-radius: 10px;
        margin-bottom: 24px;
        display: none;
        font-weight: 500;
        font-size: 14px;
    }
    
    .status-success {
        background: #e6f4ea;
        color: #1e7b48;
        border: 1px solid #cce5d9;
    }
    
    .status-error {
        background: #fee9e6;
        color: #b13e3e;
        border: 1px solid #fadbd8;
    }
    
    fieldset {
        border: 1px solid #eef2f5;
        border-radius: 14px;
        padding: 20px 24px;
        margin-bottom: 28px;
        background: white;
    }
    
    legend {
        font-weight: 600;
        font-size: 16px;
        padding: 0 12px;
        width: auto;
        color: #11173C;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        font-weight: 500;
        font-size: 13px;
        margin-bottom: 6px;
        color: #2c3e50;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        font-family: 'Work Sans', sans-serif;
        font-size: 14px;
        background: white;
        color: #1a2c3e;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    
    .score-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 16px;
    }
    
    .checkbox-group {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 8px;
    }
    
    .checkbox-group label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: normal;
        cursor: pointer;
        font-size: 13px;
        margin-bottom: 0;
    }
    
    .model-item {
        background: #fafbfc;
        border-radius: 14px;
        padding: 20px;
        margin-bottom: 20px;
        border: 1px solid #eef2f5;
    }
    
    .model-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
        padding-bottom: 12px;
        border-bottom: 1px solid #eef2f5;
    }
    
    .model-header h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: #2C5F8A;
    }
    
    .btn-icon {
        background: transparent;
        border: 1px solid #e2e8f0;
        font-size: 16px;
        cursor: pointer;
        color: #dc3545;
        padding: 6px 12px;
        border-radius: 8px;
    }
    
    .btn-icon:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    
    .form-actions {
        display: flex;
        gap: 16px;
        justify-content: flex-end;
        margin-top: 28px;
        padding-top: 24px;
        border-top: 1px solid #eef2f5;
    }
    
    .btn-danger {
        background: #dc3545;
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 10px;
        font-family: 'Work Sans', sans-serif;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
    }
    
    .brand-list-item {
        background: white;
        border-radius: 14px;
        padding: 20px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        border: 1px solid #eef2f5;
        cursor: pointer;
    }
    
    .brand-list-item:hover {
        border-color: #2C5F8A;
    }
    
    .brand-list-name {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 4px;
        color: #11173C;
    }
    
    .brand-list-models {
        font-size: 12px;
        color: #8e9aab;
    }
    
    .brand-list-actions {
        display: flex;
        gap: 10px;
        pointer-events: auto;
    }
    
    .json-preview-container {
        background: #1e293b;
        border-radius: 12px;
        overflow: hidden;
    }
    
    .json-preview-header {
        background: #0f172a;
        padding: 12px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .json-preview {
        padding: 20px;
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.6;
        color: #e2e8f0;
        max-height: 500px;
        overflow-y: auto;
        white-space: pre-wrap;
    }
    
    .file-input-wrapper {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        flex-wrap: wrap;
    }
    
    .logo-preview {
        margin-top: 8px;
    }
    
    .logo-preview img {
        max-width: 80px;
        max-height: 40px;
        object-fit: contain;
    }
    
    .view-section {
        margin-bottom: 28px;
    }
    
    .view-section h3 {
        font-size: 16px;
        font-weight: 600;
        color: #2C5F8A;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 2px solid #eef2f5;
    }
    
    .view-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
    }
    
    .view-item {
        background: #fafbfc;
        padding: 12px 16px;
        border-radius: 10px;
    }
    
    .view-item label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #8e9aab;
        display: block;
        margin-bottom: 4px;
    }
    
    .view-value {
        font-size: 14px;
        font-weight: 500;
        color: #1a2c3e;
    }
    
    .model-card {
        background: #fafbfc;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        border: 1px solid #eef2f5;
    }
    
    .feature-tag {
        display: inline-block;
        background: rgba(44, 95, 138, 0.1);
        color: #2C5F8A;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        margin: 4px 4px 0 0;
    }
    
    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
        .brand-list-item {
            flex-direction: column;
            align-items: flex-start;
        }
        .brand-list-actions {
            align-self: flex-end;
        }
        .form-actions {
            flex-direction: column;
        }
        .form-actions button {
            width: 100%;
        }
    }
    <?php
    return ob_get_clean();
}

function sp_get_detailed_css() {
    ob_start();
    ?>
    .comparison-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 32px;
    }
    
    .comparison-header {
        background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
        border-radius: 28px;
        padding: 32px 40px;
        margin-bottom: 40px;
        border: 1px solid var(--border-light);
    }
    
    .brand-card {
        background: white;
        border-radius: 20px;
        padding: 24px;
        border: 1px solid var(--border-light);
        transition: all 0.2s ease;
    }
    
    .spec-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 20px;
        overflow: hidden;
    }
    
    .spec-table th {
        background: var(--bg-light);
        padding: 16px 20px;
        text-align: left;
        font-weight: 600;
        color: var(--heading-color);
    }
    
    .spec-table td {
        padding: 12px 20px;
        border-bottom: 1px solid var(--border-light);
    }
    
    .score-badge {
        display: inline-block;
        background: linear-gradient(135deg, #5E00FF 0%, #C800FF 100%);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .review-card {
        background: white;
        border-radius: 20px;
        padding: 24px;
        border: 1px solid var(--border-light);
    }
    
    .expert-quote {
        background: var(--bg-light);
        padding: 20px;
        border-radius: 16px;
        margin-top: 16px;
        border-left: 3px solid var(--primary);
        font-style: italic;
        font-size: 14px;
        color: #5a6874;
    }
    
    .feature-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 16px 0;
    }
    
    .feature-tag {
        background: rgba(44, 95, 138, 0.1);
        color: var(--accent-blue);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .firmness-bar-container {
        background: #e9ecef;
        height: 8px;
        border-radius: 10px;
        width: 100%;
        margin-top: 8px;
    }
    
    .firmness-fill {
        height: 8px;
        border-radius: 10px;
        background: linear-gradient(135deg, #5E00FF 0%, #C800FF 100%);
        width: 0%;
    }
    
    .error-message {
        text-align: center;
        padding: 60px 20px;
        background: var(--bg-light);
        border-radius: 28px;
    }
    
    @media (max-width: 768px) {
        .comparison-container {
            padding: 0 20px;
        }
        .comparison-header {
            padding: 20px;
        }
        .spec-table th,
        .spec-table td {
            padding: 12px;
        }
    }
    <?php
    return ob_get_clean();
}

// ============================================
// INLINE JS FUNCTIONS
// ============================================
function sp_get_comparison_js() {
    ob_start();
    ?>
    let selectedSlotA = localStorage.getItem('selectedSlotA') || null;
    let selectedSlotB = localStorage.getItem('selectedSlotB') || null;
    let currentFilters = {
        sleepPosition: localStorage.getItem('sleepPosition') || "all",
        type: localStorage.getItem('type') || "all",
        budget: localStorage.getItem('budget') || "all"
    };
    let mattressData = {};
    let topComparisons = [];
    let currentModels = {};
    
    function loadData() {
        fetch(spApi.root + 'sleepare/v1/mattresses', {
            headers: {
                'X-WP-Nonce': spApi.nonce
            }
        })
        .then(response => response.json())
        .then(data => {
            mattressData = data.mattresses;
            topComparisons = data.topComparisons || [];
            Object.keys(mattressData).forEach(brand => {
                if (mattressData[brand].models && mattressData[brand].models.length > 0) {
                    currentModels[brand] = 0;
                }
            });
            renderTopComparisons();
            renderMattressGrid();
            renderCompactSlots();
            updateDeepComparisonButton();
            console.log('Data loaded:', Object.keys(mattressData).length, 'brands');
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('mattressGrid').innerHTML = '<div class="error-message">Error loading mattress data. Please try again.</div>';
        });
    }
    
    function getCurrentModel(brand) {
        if (!mattressData[brand] || !mattressData[brand].models || mattressData[brand].models.length === 0) return null;
        return mattressData[brand].models[currentModels[brand] || 0];
    }
    
    function selectModel(brand, modelIndex) {
        if (mattressData[brand] && mattressData[brand].models[modelIndex]) {
            currentModels[brand] = modelIndex;
            return true;
        }
        return false;
    }
    
    function renderStars(rating) {
        const fullStars = Math.floor(rating);
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) starsHtml += '★';
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) starsHtml += '☆';
        return `<span style="color: #FFB800;">${starsHtml}</span> <strong>${rating}/5</strong>`;
    }
    
    function renderModelSelector(brand, currentModelIndex) {
        const brandData = mattressData[brand];
        if (!brandData || !brandData.models || brandData.models.length <= 1) return '';
        return `
            <div class="model-selector">
                ${brandData.models.map((model, idx) => `
                    <span class="model-badge ${idx === currentModelIndex ? 'active' : ''}" data-brand="${brand}" data-model-index="${idx}">
                        ${model.name.split(' ').pop() || model.name}
                    </span>
                `).join('')}
            </div>
        `;
    }
    
    function renderMattressGrid() {
        const grid = document.getElementById('mattressGrid');
        if (!grid) return;
        
        const filteredMattresses = Object.entries(mattressData).filter(([name, data]) => {
            const currentModel = getCurrentModel(name);
            if (!currentModel) return false;
            if (currentFilters.sleepPosition !== "all" && !currentModel.sleepPosition.includes(currentFilters.sleepPosition)) return false;
            if (currentFilters.type !== "all") {
                const typeLower = currentModel.type.toLowerCase();
                if (currentFilters.type === "memory foam" && !typeLower.includes("memory")) return false;
                if (currentFilters.type === "hybrid" && !typeLower.includes("hybrid")) return false;
                if (currentFilters.type === "latex" && !typeLower.includes("latex")) return false;
            }
            if (currentFilters.budget !== "all") {
                const priceVal = currentModel.priceValue;
                if (currentFilters.budget === "under1000" && priceVal >= 1000) return false;
                if (currentFilters.budget === "1000-2000" && (priceVal < 1000 || priceVal > 2000)) return false;
                if (currentFilters.budget === "over2000" && priceVal <= 2000) return false;
            }
            return true;
        });
        
        if (filteredMattresses.length === 0) {
            grid.innerHTML = '<div style="text-align: center; padding: 40px;">No mattresses match your filters</div>';
            return;
        }
        
        grid.innerHTML = filteredMattresses.map(([name, data]) => {
            const currentModel = getCurrentModel(name);
            const currentModelIndex = currentModels[name] || 0;
            const isSelectedA = selectedSlotA === name;
            const isSelectedB = selectedSlotB === name;
            let selectedClass = '';
            if (isSelectedA) selectedClass = 'selected-a';
            if (isSelectedB) selectedClass = 'selected-b';
            
            return `
                <div class="mattress-card ${selectedClass}" data-brand="${name}">
                    <div class="mattress-card-info">
                        <img src="${data.logo}" alt="${name}" class="brand-logo" onerror="this.style.display='none'">
                        <div class="model-name">${currentModel.name}</div>
                        <p>${(currentModel.tagline || '').substring(0, 50)}</p>
                        ${renderModelSelector(name, currentModelIndex)}
                    </div>
                    <div class="mattress-card-price">${currentModel.price}</div>
                    <div class="mattress-card-actions">
                        <button class="btn-card-compare" data-brand="${name}">Compare</button>
                        <button class="btn-card-details" data-brand="${name}">Info</button>
                    </div>
                </div>
            `;
        }).join('');
        
        document.querySelectorAll('.model-badge').forEach(badge => {
            badge.addEventListener('click', (e) => {
                e.stopPropagation();
                const brand = badge.getAttribute('data-brand');
                const modelIndex = parseInt(badge.getAttribute('data-model-index'));
                if (selectModel(brand, modelIndex)) {
                    renderMattressGrid();
                    if (selectedSlotA === brand || selectedSlotB === brand) {
                        renderCompactSlots();
                    }
                    saveComparisonState();
                }
            });
        });
        
        document.querySelectorAll('.btn-card-compare').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToComparison(btn.getAttribute('data-brand'));
            });
        });
        
        document.querySelectorAll('.btn-card-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(btn.getAttribute('data-brand'));
            });
        });
    }
    
    function addToComparison(brand) {
        if (!selectedSlotA) {
            selectedSlotA = brand;
        } else if (!selectedSlotB) {
            selectedSlotB = brand;
        } else {
            selectedSlotB = brand;
        }
        saveComparisonState();
        renderCompactSlots();
        renderMattressGrid();
        updateDeepComparisonButton();
    }
    
    function renderCompactSlots() {
        const slotA = document.getElementById('compactSlotA');
        const slotB = document.getElementById('compactSlotB');
        
        function renderSlot(slot, brand, slotName) {
            if (brand && mattressData[brand]) {
                const currentModel = getCurrentModel(brand);
                const data = mattressData[brand];
                slot.innerHTML = `
                    <div class="compact-slot-header">
                        <img src="${data.logo}" alt="${brand}" class="brand-logo-compact" onerror="this.style.display='none'">
                        <button class="remove-slot" data-slot="${slotName}">×</button>
                    </div>
                    <div style="text-align: center; margin: 12px 0 8px 0;">
                        <div style="font-size: 20px; font-weight: 800; color: var(--primary);">${data.rating}<span style="font-size: 14px; color: #8e9aab;">/5</span></div>
                        <div style="font-size: 12px; color: #FFB800; margin-top: 2px;">${'★'.repeat(Math.floor(data.rating))}${'☆'.repeat(5 - Math.floor(data.rating))}</div>
                    </div>
                    <div style="font-size: 14px; font-weight: 700; text-align: center; margin-bottom: 8px;">${currentModel.name}</div>
                    <ul class="compact-feature-list">
                        <li><span>Type</span><span>${currentModel.type.split('/')[0]}</span></li>
                        <li><span>Firmness</span><span>${currentModel.firmnessText}</span></li>
                    </ul>
                    <div style="margin-top: 12px;">
                        <button class="btn-card-details" data-brand="${brand}" style="width: 100%; padding: 8px; font-size: 12px;">Info</button>
                    </div>
                `;
                slot.classList.add('filled');
                slot.querySelector('.remove-slot')?.addEventListener('click', () => {
                    if (slotName === 'A') selectedSlotA = null;
                    else selectedSlotB = null;
                    saveComparisonState();
                    renderCompactSlots();
                    renderMattressGrid();
                    updateDeepComparisonButton();
                });
                slot.querySelector('.btn-card-details')?.addEventListener('click', () => openModal(brand));
            } else {
                slot.innerHTML = `<div class="compact-slot-empty"><span>Select a mattress to compare</span></div>`;
                slot.classList.remove('filled');
            }
        }
        
        renderSlot(slotA, selectedSlotA, 'A');
        renderSlot(slotB, selectedSlotB, 'B');
    }
    
    function updateDeepComparisonButton() {
        const deepContainer = document.getElementById('deepComparisonContainer');
        const deepBtn = document.getElementById('deepComparisonBtn');
        
        if (selectedSlotA && selectedSlotB && deepContainer) {
            deepContainer.style.display = 'block';
            if (deepBtn) {
                const modelA = currentModels[selectedSlotA] || 0;
                const modelB = currentModels[selectedSlotB] || 0;
                deepBtn.href = `/detailed-comparison/?compare=${encodeURIComponent(selectedSlotA)}|${encodeURIComponent(selectedSlotB)}|${modelA}|${modelB}`;
            }
        } else if (deepContainer) {
            deepContainer.style.display = 'none';
        }
    }
    
    function swapComparison() {
        if (selectedSlotA && selectedSlotB) {
            [selectedSlotA, selectedSlotB] = [selectedSlotB, selectedSlotA];
            saveComparisonState();
            renderCompactSlots();
            renderMattressGrid();
            updateDeepComparisonButton();
        }
    }
    
    function openModal(brand) {
        const modal = document.getElementById('mattressModal');
        const modalContent = document.getElementById('modalContent');
        const data = mattressData[brand];
        const currentModel = getCurrentModel(brand);
        if (!data) return;
        
        modalContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 24px;">
                <img src="${data.logo}" alt="${brand}" style="max-width: 140px; max-height: 48px; object-fit: contain; margin-bottom: 12px;" onerror="this.style.display='none'">
                <div style="font-size: 22px; font-weight: 700; margin-top: 16px;">${currentModel.name}</div>
                <div style="margin-top: 8px;">
                    <span style="font-size: 32px; font-weight: 800; color: var(--primary);">${data.rating}</span><span style="font-size: 16px;">/5</span>
                    <div style="color: #FFB800; margin-top: 4px;">${'★'.repeat(Math.floor(data.rating))}${'☆'.repeat(5 - Math.floor(data.rating))}</div>
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <p style="color: #5a6874; text-align: center; font-style: italic;">${currentModel.tagline}</p>
            </div>
            <div style="margin-bottom: 20px;">
                <h4>Key Specifications</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
                    <div style="background: #fafbff; padding: 12px; border-radius: 12px;">
                        <strong>Type</strong><br>${currentModel.type}
                    </div>
                    <div style="background: #fafbff; padding: 12px; border-radius: 12px;">
                        <strong>Firmness</strong><br>${currentModel.firmnessText} (${currentModel.firmness}/10)
                    </div>
                    <div style="background: #fafbff; padding: 12px; border-radius: 12px;">
                        <strong>Best For</strong><br>${currentModel.bestFor}
                    </div>
                    <div style="background: #fafbff; padding: 12px; border-radius: 12px;">
                        <strong>Price (Queen)</strong><br>${currentModel.price}
                    </div>
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <h4>Key Features</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                    ${currentModel.keyFeatures.map(f => `<span style="background: rgba(44, 95, 138, 0.1); padding: 6px 12px; border-radius: 20px; font-size: 12px;">${f}</span>`).join('')}
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <h4>Additional Details</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; border-bottom: 1px solid #eef2f5;"><strong>Cooling:</strong> ${currentModel.cooling}</li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #eef2f5;"><strong>Motion Isolation:</strong> ${currentModel.motionIsolation}</li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #eef2f5;"><strong>Edge Support:</strong> ${currentModel.edgeSupport}</li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #eef2f5;"><strong>Trial:</strong> ${data.trial || "100 nights"}</li>
                    <li style="padding: 8px 0;"><strong>Warranty:</strong> ${data.warranty || "10 years"}</li>
                </ul>
            </div>
            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <a href="https://www.sleepare.com/shop/" class="btn-primary" style="flex: 1; text-align: center;" target="_blank">Shop ${brand} →</a>
                <a href="https://www.sleepare.com/mattress-stores/" class="btn-outline" style="flex: 1; text-align: center;" target="_blank">Find a Store</a>
            </div>
        `;
        modal.style.display = 'block';
    }
    
    function openElementModal(elementId) {
        const modal = document.getElementById('mattressModal');
        const modalContent = document.getElementById('modalContent');
        
        const elements = {
            materials: {
                name: "Materials",
                description: `<p><strong>The materials your mattress is made from is often the ultimate deciding factor in purchasing a new mattress.</strong></p>
                <p>Each type of mattress provides different benefits and comfort. The type of mattress you choose depends on personal preference. There is no way to know for sure what mattress suits you best until you try, but we can recommend certain types of mattresses for specific needs. For example, latex and organic mattresses are recommended for those who suffer from allergies.</p>
                <p>When selecting mattress materials, make sure to consider your primary sleep position as well. Every sleep position benefits from a different type of mattress.</p>
                <p>If you are unsure what type of mattress would work the best for you, one of the experts at SleePare can recommend your perfect mattress!</p>`
            },
            brand: {
                name: "Brand & Reputation",
                description: `<p><strong>With so many brands available, it can be difficult to decide which ones are worth checking out.</strong></p>
                <p>If you find a mattress that catches your eye, do some research on the brand before moving forward with a purchase. Make sure to purchase from a reputable brand and read credible reviews from customers and mattress review websites like SleePare.</p>
                <p>Once you decide on a brand, additional information about the brand can help you decide on your purchase. Make sure to research important information like return policy, warranties, delivery, and trial periods before making a purchase.</p>`
            },
            bodyType: {
                name: "Body Type Suitability",
                description: `<p><strong>Many people do not consider their body type when purchasing and comparing mattresses.</strong></p>
                <p>Support and pressure distribution varies for different body types and builds. Visit our website to learn more about the best mattresses for heavier individuals.</p>`
            },
            couples: {
                name: "Couples Adjustability",
                description: `<p><strong>Sleeping with a partner brings its own set of challenges.</strong></p>
                <p>If you are sleeping with someone else, it is best to consider features that make sleeping with a partner more comfortable. Features that work the best for couples include edge support, motion isolation, and mattresses with adjustable or more than one comfortable level.</p>`
            },
            price: {
                name: "Price & Value",
                description: `<p><strong>Setting a budget once you start shopping lets you narrow down your selections so you can pick the best option for your body and wallet.</strong></p>
                <p>Often, higher-priced, luxury mattresses come with more features and fluff than value and functionality. Narrowing down your choices will help you find a quality mattress that will last and include the features you want without paying for unneeded features.</p>`
            }
        };
        
        const el = elements[elementId];
        if (!el) return;
        
        modalContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 24px;">
                <h3 style="margin-bottom: 8px;">${el.name}</h3>
            </div>
            <div style="margin-bottom: 24px; line-height: 1.6;">
                ${el.description}
            </div>
            <div style="display: flex; gap: 12px;">
                <a href="https://www.sleepare.com/mattress-stores/" class="btn-primary" style="flex: 1; text-align: center;" target="_blank">Visit a Showroom</a>
                <button class="btn-outline" onclick="document.getElementById('mattressModal').style.display='none';">Close</button>
            </div>
        `;
        modal.style.display = 'block';
    }
    
    function renderTopComparisons() {
        const grid = document.getElementById('comparisonsGrid');
        if (!grid || !topComparisons) return;
        
        grid.innerHTML = topComparisons.map(comp => {
            const brand1 = mattressData[comp.brand1];
            const brand2 = mattressData[comp.brand2];
            if (!brand1 || !brand2) return '';
            return `
                <div class="comparison-tag" data-m1="${comp.brand1}" data-m2="${comp.brand2}">
                    <span>${comp.brand1}</span>
                    <img src="${brand1.logo}" alt="${comp.brand1}" class="brand-logo-tag" onerror="this.style.display='none'">
                    <span class="vs-text">VS</span>
                    <img src="${brand2.logo}" alt="${comp.brand2}" class="brand-logo-tag" onerror="this.style.display='none'">
                    <span>${comp.brand2}</span>
                </div>
            `;
        }).join('');
        
        document.querySelectorAll('.comparison-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const brand1 = tag.getAttribute('data-m1');
                const brand2 = tag.getAttribute('data-m2');
                if (brand1 && brand2) {
                    selectedSlotA = brand1;
                    selectedSlotB = brand2;
                    saveComparisonState();
                    renderCompactSlots();
                    renderMattressGrid();
                    updateDeepComparisonButton();
                    const comparisonSection = document.querySelector('.comparison-layout');
                    if (comparisonSection) comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    function saveComparisonState() {
        localStorage.setItem('selectedSlotA', selectedSlotA);
        localStorage.setItem('selectedSlotB', selectedSlotB);
        localStorage.setItem('sleepPosition', currentFilters.sleepPosition);
        localStorage.setItem('type', currentFilters.type);
        localStorage.setItem('budget', currentFilters.budget);
    }
    
    function initFilters() {
        const sleepSelect = document.getElementById('sleepPositionSelect');
        const typeSelect = document.getElementById('typeSelect');
        const budgetSelect = document.getElementById('budgetSelect');
        const resetBtn = document.getElementById('resetFiltersSimple');
        
        if (sleepSelect) sleepSelect.value = currentFilters.sleepPosition;
        if (typeSelect) typeSelect.value = currentFilters.type;
        if (budgetSelect) budgetSelect.value = currentFilters.budget;
        
        if (sleepSelect) sleepSelect.addEventListener('change', () => {
            currentFilters.sleepPosition = sleepSelect.value;
            saveComparisonState();
            renderMattressGrid();
        });
        if (typeSelect) typeSelect.addEventListener('change', () => {
            currentFilters.type = typeSelect.value;
            saveComparisonState();
            renderMattressGrid();
        });
        if (budgetSelect) budgetSelect.addEventListener('change', () => {
            currentFilters.budget = budgetSelect.value;
            saveComparisonState();
            renderMattressGrid();
        });
        if (resetBtn) resetBtn.addEventListener('click', () => {
            if (sleepSelect) sleepSelect.value = 'all';
            if (typeSelect) typeSelect.value = 'all';
            if (budgetSelect) budgetSelect.value = 'all';
            currentFilters = { sleepPosition: 'all', type: 'all', budget: 'all' };
            saveComparisonState();
            renderMattressGrid();
        });
    }
    
    function initFaq() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (question && answer) {
                answer.style.maxHeight = '0px';
                answer.style.overflow = 'hidden';
                answer.style.transition = 'max-height 0.25s ease-out';
                question.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.classList.toggle('active');
                    if (item.classList.contains('active')) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    } else {
                        answer.style.maxHeight = '0px';
                    }
                });
            }
        });
    }
    
    function initElements() {
        document.querySelectorAll('.element-card').forEach((card) => {
            const elementType = card.getAttribute('data-element');
            card.addEventListener('click', () => {
                openElementModal(elementType);
            });
        });
    }
    
    function initModal() {
        const modal = document.getElementById('mattressModal');
        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (modal && e.target === modal) modal.style.display = 'none';
        });
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        loadData();
        initFilters();
        initFaq();
        initElements();
        initModal();
        const swapBtn = document.getElementById('swapCompact');
        if (swapBtn) swapBtn.addEventListener('click', swapComparison);
    });
    <?php
    return ob_get_clean();
}

function sp_get_admin_js() {
    ob_start();
    ?>
    let currentEditBrand = null;
    let currentModalBrand = null;
    
    const DEFAULT_BRAND = {
        logo: "",
        rating: 4.5,
        warranty: "10 years",
        trial: "100 nights",
        expertSummary: "",
        accentColor: "#2C5F8A",
        scores: { type: 7, support: 7, value: 7, price: 7, materials: 7 },
        customerRatingCount: 0,
        customerComfort: 4.5,
        customerSupport: 4.5,
        customerCooling: 4.5,
        models: []
    };
    
    const DEFAULT_MODEL = {
        name: "",
        type: "Hybrid",
        typeCategory: "hybrid",
        firmness: 6,
        firmnessText: "Medium",
        price: "",
        priceValue: 0,
        bestFor: "",
        sleepPosition: [],
        keyFeatures: [],
        tagline: "",
        cooling: "",
        motionIsolation: "Good",
        edgeSupport: "Good"
    };
    
    const VALID_TYPES = ["Memory Foam", "Hybrid", "Latex", "Natural Latex", "Hybrid / Latex", "Flippable Foam"];
    const VALID_TYPE_CATEGORIES = ["foam", "hybrid", "latex"];
    const VALID_SLEEP_POSITIONS = ["back", "side", "stomach", "combination"];
    const VALID_MOTION_EDGE = ["Poor", "Good", "Very Good", "Excellent"];
    
    let mattressData = {};
    let topComparisons = [];
    
    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    function showStatus(message, isError = false) {
        const statusDiv = document.getElementById('statusMessage');
        if (!statusDiv) return;
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${isError ? 'status-error' : 'status-success'}`;
        statusDiv.style.display = 'block';
        setTimeout(() => { statusDiv.style.display = 'none'; }, 3000);
    }
    
    function confirmAction(message, callback) {
        if (confirm(message)) callback();
    }
    
    function beautifyJSON(data) {
        return JSON.stringify(data, null, 2);
    }
    
    function loadAdminData() {
        fetch(spApi.root + 'sleepare/v1/mattresses', {
            headers: { 'X-WP-Nonce': spApi.nonce }
        })
        .then(response => response.json())
        .then(data => {
            mattressData = data.mattresses;
            topComparisons = data.topComparisons || [];
            populateBrandSelect();
            renderBrandsList();
            updateJsonPreview();
            renderAddForm();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            showStatus('Error loading mattress data', true);
        });
    }
    
    function saveToWordPress() {
        // Save via API is handled by individual save operations
        // This function just triggers a refresh
        loadAdminData();
        showStatus('Data refreshed from WordPress');
    }
    
    function getModelFormTemplate(index, modelData = null) {
        const m = modelData ? { ...DEFAULT_MODEL, ...modelData } : { ...DEFAULT_MODEL };
        return `
            <div class="model-item" data-model-index="${index}">
                <div class="model-header">
                    <h4>Model ${index + 1}</h4>
                    <button type="button" class="btn-icon remove-model-btn" data-index="${index}" ${index === 0 ? 'disabled' : ''}>✕ Remove</button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Model Name *</label>
                        <input type="text" class="model-name" value="${escapeHtml(m.name)}" placeholder="e.g., Avocado Green" required>
                    </div>
                    <div class="form-group">
                        <label>Tagline</label>
                        <input type="text" class="model-tagline" value="${escapeHtml(m.tagline)}" placeholder="Short description for this model">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Type</label>
                        <select class="model-type">
                            ${VALID_TYPES.map(t => `<option value="${t}" ${m.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Type Category</label>
                        <select class="model-type-category">
                            ${VALID_TYPE_CATEGORIES.map(c => `<option value="${c}" ${m.typeCategory === c ? 'selected' : ''}>${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Firmness (1-10)</label>
                        <input type="number" class="model-firmness" min="1" max="10" step="0.5" value="${m.firmness}">
                    </div>
                    <div class="form-group">
                        <label>Firmness Text</label>
                        <input type="text" class="model-firmness-text" value="${escapeHtml(m.firmnessText)}" placeholder="e.g., Medium, Firm, Soft">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Price Range</label>
                        <input type="text" class="model-price" value="${escapeHtml(m.price)}" placeholder="$1,299 – $2,399">
                    </div>
                    <div class="form-group">
                        <label>Price Value (numeric)</label>
                        <input type="number" class="model-price-value" value="${m.priceValue}" placeholder="1599">
                    </div>
                </div>
                <div class="form-group">
                    <label>Best For</label>
                    <input type="text" class="model-best-for" value="${escapeHtml(m.bestFor)}" placeholder="Eco-conscious, back sleepers, hot sleepers">
                </div>
                <div class="form-group">
                    <label>Sleep Positions</label>
                    <div class="checkbox-group">
                        ${VALID_SLEEP_POSITIONS.map(pos => `
                            <label>
                                <input type="checkbox" class="sleep-position" value="${pos}" ${m.sleepPosition.includes(pos) ? 'checked' : ''}>
                                ${pos.charAt(0).toUpperCase() + pos.slice(1)}
                            </label>
                        `).join('')}
                    </div>
                </div>
                <div class="form-group">
                    <label>Key Features</label>
                    <input type="text" class="model-features" value="${escapeHtml(m.keyFeatures.join(', '))}" placeholder="Organic, Natural Latex, Eco-friendly (comma separated)">
                </div>
                <div class="form-group">
                    <label>Cooling Technology</label>
                    <input type="text" class="model-cooling" value="${escapeHtml(m.cooling)}" placeholder="Natural latex, organic cotton, gel-infused foam">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Motion Isolation</label>
                        <select class="model-motion">
                            ${VALID_MOTION_EDGE.map(opt => `<option value="${opt}" ${m.motionIsolation === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Edge Support</label>
                        <select class="model-edge">
                            ${VALID_MOTION_EDGE.map(opt => `<option value="${opt}" ${m.edgeSupport === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <hr class="model-divider">
            </div>
        `;
    }
    
    function buildMattressDataFromForm(formContainer) {
        const brandName = formContainer.querySelector('#brandName')?.value;
        const logo = formContainer.querySelector('#logoUrl')?.value || '';
        const tagline = formContainer.querySelector('#tagline')?.value || '';
        const expertSummary = formContainer.querySelector('#expertSummary')?.value || '';
        const overallRating = parseFloat(formContainer.querySelector('#overallRating')?.value) || 4.5;
        const warranty = formContainer.querySelector('#warranty')?.value || '10 years';
        const trial = formContainer.querySelector('#trial')?.value || '100 nights';
        const accentColor = formContainer.querySelector('#accentColor')?.value || '#2C5F8A';
        
        const scores = {
            type: parseInt(formContainer.querySelector('#scoreType')?.value) || 7,
            support: parseInt(formContainer.querySelector('#scoreSupport')?.value) || 7,
            value: parseInt(formContainer.querySelector('#scoreValue')?.value) || 7,
            price: parseInt(formContainer.querySelector('#scorePrice')?.value) || 7,
            materials: parseInt(formContainer.querySelector('#scoreMaterials')?.value) || 7
        };
        
        const customerRatingCount = parseInt(formContainer.querySelector('#customerRatingCount')?.value) || 0;
        const customerComfort = parseFloat(formContainer.querySelector('#customerComfort')?.value) || 4.5;
        const customerSupport = parseFloat(formContainer.querySelector('#customerSupport')?.value) || 4.5;
        const customerCooling = parseFloat(formContainer.querySelector('#customerCooling')?.value) || 4.5;
        
        const models = [];
        const modelItems = formContainer.querySelectorAll('.model-item');
        modelItems.forEach(item => {
            const sleepPositions = Array.from(item.querySelectorAll('.sleep-position:checked')).map(cb => cb.value);
            const featuresInput = item.querySelector('.model-features')?.value || '';
            const keyFeatures = featuresInput.split(',').map(f => f.trim()).filter(f => f);
            
            models.push({
                name: item.querySelector('.model-name')?.value || '',
                type: item.querySelector('.model-type')?.value || 'Hybrid',
                typeCategory: item.querySelector('.model-type-category')?.value || 'hybrid',
                firmness: parseFloat(item.querySelector('.model-firmness')?.value) || 6,
                firmnessText: item.querySelector('.model-firmness-text')?.value || 'Medium',
                price: item.querySelector('.model-price')?.value || '',
                priceValue: parseInt(item.querySelector('.model-price-value')?.value) || 0,
                bestFor: item.querySelector('.model-best-for')?.value || '',
                sleepPosition: sleepPositions,
                keyFeatures: keyFeatures,
                tagline: tagline,
                cooling: item.querySelector('.model-cooling')?.value || '',
                motionIsolation: item.querySelector('.model-motion')?.value || 'Good',
                edgeSupport: item.querySelector('.model-edge')?.value || 'Good'
            });
        });
        
        return { brandName, data: {
            logo, models, rating: overallRating, warranty, trial, expertSummary, accentColor,
            scores, customerRatingCount, customerComfort, customerSupport, customerCooling
        } };
    }
    
    function getLogoUploadHtml(currentUrl = '') {
        return `
            <div class="file-input-wrapper">
                <input type="file" class="logo-file-input" accept="image/*">
                <input type="text" class="logo-url-input" id="logoUrl" value="${escapeHtml(currentUrl)}" placeholder="https://example.com/logo.png or /wp-content/uploads/...">
            </div>
            <div class="logo-preview">
                <img class="logo-preview-img" src="${escapeHtml(currentUrl)}" alt="Logo preview" style="max-width: 80px; max-height: 40px; display: ${currentUrl ? 'block' : 'none'}">
                <small>Upload a file or enter a URL</small>
            </div>
        `;
    }
    
    function setupLogoUpload(container) {
        const fileInput = container.querySelector('.logo-file-input');
        const urlInput = container.querySelector('.logo-url-input');
        const preview = container.querySelector('.logo-preview-img');
        
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        if (urlInput) urlInput.value = event.target.result;
                        if (preview) preview.src = event.target.result;
                        if (preview) preview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        if (urlInput) {
            urlInput.addEventListener('input', function(e) {
                if (preview) preview.src = e.target.value;
                if (preview && e.target.value) preview.style.display = 'block';
                else if (preview && !e.target.value) preview.style.display = 'none';
            });
        }
    }
    
    function renderEditForm(brandName) {
        const brand = mattressData[brandName];
        if (!brand) return;
        
        const container = document.getElementById('editFormContainer');
        if (!container) return;
        
        const currentTagline = brand.models?.[0]?.tagline || '';
        
        const html = `
            <form id="editMattressForm">
                <fieldset>
                    <legend>Brand Identity</legend>
                    <div class="form-group">
                        <label>Brand Name *</label>
                        <input type="text" id="brandName" value="${escapeHtml(brandName)}" required>
                    </div>
                    <div class="form-group">
                        <label>Logo URL *</label>
                        ${getLogoUploadHtml(brand.logo)}
                    </div>
                    <div class="form-group">
                        <label>Tagline</label>
                        <input type="text" id="tagline" value="${escapeHtml(currentTagline)}" placeholder="Short phrase shown on cards">
                    </div>
                    <div class="form-group">
                        <label>Expert Summary</label>
                        <textarea id="expertSummary" rows="3">${escapeHtml(brand.expertSummary)}</textarea>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>Expert Scores (1-10)</legend>
                    <div class="score-grid">
                        <div class="form-group"><label>Material Type</label><input type="number" id="scoreType" min="1" max="10" value="${brand.scores.type}"></div>
                        <div class="form-group"><label>Support</label><input type="number" id="scoreSupport" min="1" max="10" value="${brand.scores.support}"></div>
                        <div class="form-group"><label>Value</label><input type="number" id="scoreValue" min="1" max="10" value="${brand.scores.value}"></div>
                        <div class="form-group"><label>Price</label><input type="number" id="scorePrice" min="1" max="10" value="${brand.scores.price}"></div>
                        <div class="form-group"><label>Materials</label><input type="number" id="scoreMaterials" min="1" max="10" value="${brand.scores.materials}"></div>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>Overall Rating</legend>
                    <div class="form-group"><label>Star Rating (1-5)</label><input type="number" id="overallRating" min="1" max="5" step="0.1" value="${brand.rating}" required></div>
                </fieldset>
                
                <fieldset>
                    <legend>Customer Review Data</legend>
                    <div class="form-group"><label>Number of Reviews</label><input type="number" id="customerRatingCount" min="0" value="${brand.customerRatingCount}"></div>
                    <div class="score-grid">
                        <div class="form-group"><label>Comfort Rating</label><input type="number" id="customerComfort" min="1" max="5" step="0.1" value="${brand.customerComfort}"></div>
                        <div class="form-group"><label>Support Rating</label><input type="number" id="customerSupport" min="1" max="5" step="0.1" value="${brand.customerSupport}"></div>
                        <div class="form-group"><label>Cooling Rating</label><input type="number" id="customerCooling" min="1" max="5" step="0.1" value="${brand.customerCooling}"></div>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>Warranty & Trial</legend>
                    <div class="form-row">
                        <div class="form-group"><label>Warranty</label><input type="text" id="warranty" value="${escapeHtml(brand.warranty)}"></div>
                        <div class="form-group"><label>Trial Period</label><input type="text" id="trial" value="${escapeHtml(brand.trial)}"></div>
                    </div>
                    <div class="form-group"><label>Accent Color</label><input type="color" id="accentColor" value="${brand.accentColor}"></div>
                </fieldset>
                
                <fieldset>
                    <legend>Mattress Models</legend>
                    <div id="modelsContainer">
                        ${brand.models.map((model, idx) => getModelFormTemplate(idx, model)).join('')}
                    </div>
                    <button type="button" id="addModelBtn" class="btn-outline" style="margin-top: 16px;">+ Add Another Model</button>
                </fieldset>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Save Changes</button>
                    <button type="button" id="deleteBrandBtn" class="btn-danger">Delete This Brand</button>
                </div>
            </form>
        `;
        
        container.innerHTML = html;
        container.style.display = 'block';
        
        setupLogoUpload(container);
        attachModelListeners();
        
        document.getElementById('editMattressForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            saveBrandEdit(brandName);
        });
        
        document.getElementById('deleteBrandBtn')?.addEventListener('click', () => {
            confirmAction(`Are you sure you want to delete "${brandName}"?`, () => deleteBrand(brandName));
        });
    }
    
    function attachModelListeners() {
        const addBtn = document.getElementById('addModelBtn');
        if (addBtn) {
            addBtn.onclick = () => {
                const container = document.getElementById('modelsContainer');
                const count = container.querySelectorAll('.model-item').length;
                container.insertAdjacentHTML('beforeend', getModelFormTemplate(count));
                attachRemoveListeners();
            };
        }
        attachRemoveListeners();
    }
    
    function attachRemoveListeners() {
        document.querySelectorAll('.remove-model-btn').forEach(btn => {
            btn.onclick = (e) => {
                const index = parseInt(btn.getAttribute('data-index'));
                const container = document.getElementById('modelsContainer');
                const models = container.querySelectorAll('.model-item');
                if (models.length > 1) {
                    confirmAction('Remove this model?', () => {
                        models[index].remove();
                        container.querySelectorAll('.model-item').forEach((item, idx) => {
                            item.setAttribute('data-model-index', idx);
                            const header = item.querySelector('h4');
                            if (header) header.textContent = `Model ${idx + 1}`;
                            const rmBtn = item.querySelector('.remove-model-btn');
                            if (rmBtn) {
                                rmBtn.setAttribute('data-index', idx);
                                rmBtn.disabled = idx === 0;
                            }
                        });
                    });
                } else {
                    showStatus('Cannot remove the last model. Add another model first.', true);
                }
            };
        });
    }
    
    function saveBrandEdit(originalBrandName) {
        const container = document.getElementById('editFormContainer');
        const newBrandName = container.querySelector('#brandName')?.value.trim();
        if (!newBrandName) {
            showStatus('Brand name is required', true);
            return;
        }
        
        const formData = buildMattressDataFromForm(container);
        
        fetch(spApi.root + 'sleepare/v1/mattresses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': spApi.nonce
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(() => {
            showStatus(`✅ "${newBrandName}" saved successfully!`);
            loadAdminData();
            const select = document.getElementById('brandSelect');
            if (select) select.value = '';
            const editContainer = document.getElementById('editFormContainer');
            if (editContainer) {
                editContainer.style.display = 'none';
                editContainer.innerHTML = '';
            }
        })
        .catch(error => {
            console.error('Error saving:', error);
            showStatus('Error saving brand', true);
        });
    }
    
    function deleteBrand(brandName) {
        const brandId = Object.keys(mattressData).findIndex(b => b === brandName);
        // Find brand ID from current data - need to get from API
        fetch(spApi.root + 'sleepare/v1/mattresses')
            .then(r => r.json())
            .then(data => {
                const brands = data.mattresses;
                const brandKeys = Object.keys(brands);
                const index = brandKeys.indexOf(brandName);
                if (index !== -1) {
                    // For now, just reload data after delete (API delete not fully implemented)
                    // In production, you'd call DELETE endpoint
                    delete mattressData[brandName];
                    saveToWordPress();
                }
            });
        
        loadAdminData();
        showStatus(`✅ "${brandName}" deleted`);
        
        const editContainer = document.getElementById('editFormContainer');
        if (editContainer) {
            editContainer.style.display = 'none';
            editContainer.innerHTML = '';
        }
        const brandSelect = document.getElementById('brandSelect');
        if (brandSelect) brandSelect.value = '';
    }
    
    function renderBrandModal(brandName) {
        const brand = mattressData[brandName];
        if (!brand) return;
        
        currentModalBrand = brandName;
        const modal = document.getElementById('brandModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = brandName;
        
        let modelsHtml = '';
        brand.models.forEach((model, idx) => {
            modelsHtml += `
                <div class="model-card">
                    <h4>${escapeHtml(model.name)}</h4>
                    <div class="view-grid">
                        <div class="view-item"><label>Type</label><div class="view-value">${escapeHtml(model.type)}</div></div>
                        <div class="view-item"><label>Firmness</label><div class="view-value">${escapeHtml(model.firmnessText)} (${model.firmness}/10)</div></div>
                        <div class="view-item"><label>Price</label><div class="view-value">${escapeHtml(model.price)}</div></div>
                        <div class="view-item"><label>Best For</label><div class="view-value">${escapeHtml(model.bestFor)}</div></div>
                        <div class="view-item"><label>Sleep Positions</label><div class="view-value">${model.sleepPosition.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ') || 'All positions'}</div></div>
                        <div class="view-item"><label>Cooling</label><div class="view-value">${escapeHtml(model.cooling) || 'Standard'}</div></div>
                        <div class="view-item"><label>Motion Isolation</label><div class="view-value">${model.motionIsolation}</div></div>
                        <div class="view-item"><label>Edge Support</label><div class="view-value">${model.edgeSupport}</div></div>
                    </div>
                    <div style="margin-top: 12px;">
                        <label>Key Features</label>
                        <div>${model.keyFeatures.map(f => `<span class="feature-tag">${escapeHtml(f)}</span>`).join('') || '—'}</div>
                    </div>
                    ${model.tagline ? `<div style="margin-top: 12px;"><label>Tagline</label><div class="view-value" style="font-style: italic;">${escapeHtml(model.tagline)}</div></div>` : ''}
                </div>
            `;
        });
        
        modalBody.innerHTML = `
            <div class="view-section">
                <h3>Brand Information</h3>
                <div class="view-grid">
                    <div class="view-item"><label>Logo</label><div class="view-value"><img src="${escapeHtml(brand.logo)}" alt="${escapeHtml(brandName)} logo" style="max-width: 80px; max-height: 40px;" onerror="this.style.display='none'"></div></div>
                    <div class="view-item"><label>Overall Rating</label><div class="view-value">${brand.rating} / 5 ★</div></div>
                    <div class="view-item"><label>Warranty</label><div class="view-value">${escapeHtml(brand.warranty)}</div></div>
                    <div class="view-item"><label>Trial Period</label><div class="view-value">${escapeHtml(brand.trial)}</div></div>
                    <div class="view-item"><label>Expert Summary</label><div class="view-value">${escapeHtml(brand.expertSummary)}</div></div>
                </div>
            </div>
            
            <div class="view-section">
                <h3>Expert Scores (1-10)</h3>
                <div class="view-grid">
                    <div class="view-item"><label>Material Type</label><div class="view-value">${brand.scores.type}</div></div>
                    <div class="view-item"><label>Support</label><div class="view-value">${brand.scores.support}</div></div>
                    <div class="view-item"><label>Value</label><div class="view-value">${brand.scores.value}</div></div>
                    <div class="view-item"><label>Price</label><div class="view-value">${brand.scores.price}</div></div>
                    <div class="view-item"><label>Materials</label><div class="view-value">${brand.scores.materials}</div></div>
                </div>
            </div>
            
            <div class="view-section">
                <h3>Customer Reviews</h3>
                <div class="view-grid">
                    <div class="view-item"><label>Total Reviews</label><div class="view-value">${brand.customerRatingCount.toLocaleString()}</div></div>
                    <div class="view-item"><label>Comfort Rating</label><div class="view-value">${brand.customerComfort} / 5</div></div>
                    <div class="view-item"><label>Support Rating</label><div class="view-value">${brand.customerSupport} / 5</div></div>
                    <div class="view-item"><label>Cooling Rating</label><div class="view-value">${brand.customerCooling} / 5</div></div>
                </div>
            </div>
            
            <div class="view-section">
                <h3>Models (${brand.models.length})</h3>
                ${modelsHtml || '<p>No models available</p>'}
            </div>
        `;
        
        modal.style.display = 'block';
    }
    
    function renderAddForm() {
        const container = document.getElementById('addFormContainer');
        if (!container) return;
        
        container.innerHTML = `
            <form id="addMattressForm">
                <fieldset>
                    <legend>Brand Identity</legend>
                    <div class="form-group"><label>Brand Name *</label><input type="text" id="brandName" required placeholder="e.g., Avocado, Casper, Nectar"></div>
                    <div class="form-group"><label>Logo URL *</label>${getLogoUploadHtml('')}</div>
                    <div class="form-group"><label>Tagline</label><input type="text" id="tagline" placeholder="e.g., The world's most comfortable mattress"></div>
                    <div class="form-group"><label>Expert Summary</label><textarea id="expertSummary" rows="3" placeholder="Expert review summary..."></textarea></div>
                </fieldset>
                
                <fieldset>
                    <legend>Expert Scores (1-10)</legend>
                    <div class="score-grid">
                        <div class="form-group"><label>Material Type</label><input type="number" id="scoreType" min="1" max="10" value="7"></div>
                        <div class="form-group"><label>Support</label><input type="number" id="scoreSupport" min="1" max="10" value="7"></div>
                        <div class="form-group"><label>Value</label><input type="number" id="scoreValue" min="1" max="10" value="7"></div>
                        <div class="form-group"><label>Price</label><input type="number" id="scorePrice" min="1" max="10" value="7"></div>
                        <div class="form-group"><label>Materials</label><input type="number" id="scoreMaterials" min="1" max="10" value="7"></div>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>Overall Rating</legend>
                    <div class="form-group"><label>Star Rating (1-5)</label><input type="number" id="overallRating" min="1" max="5" step="0.1" value="4.5" required></div>
                </fieldset>
                
                <fieldset>
                    <legend>Customer Review Data</legend>
                    <div class="form-group"><label>Number of Reviews</label><input type="number" id="customerRatingCount" min="0" value="0"></div>
                    <div class="score-grid">
                        <div class="form-group"><label>Comfort Rating</label><input type="number" id="customerComfort" min="1" max="5" step="0.1" value="4.5"></div>
                        <div class="form-group"><label>Support Rating</label><input type="number" id="customerSupport" min="1" max="5" step="0.1" value="4.5"></div>
                        <div class="form-group"><label>Cooling Rating</label><input type="number" id="customerCooling" min="1" max="5" step="0.1" value="4.5"></div>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>Warranty & Trial</legend>
                    <div class="form-row">
                        <div class="form-group"><label>Warranty</label><input type="text" id="warranty" value="10 years"></div>
                        <div class="form-group"><label>Trial Period</label><input type="text" id="trial" value="100 nights"></div>
                    </div>
                    <div class="form-group"><label>Accent Color</label><input type="color" id="accentColor" value="#2C5F8A"></div>
                </fieldset>
                
                <fieldset>
                    <legend>Mattress Models</legend>
                    <div id="modelsContainer">${getModelFormTemplate(0)}</div>
                    <button type="button" id="addModelBtn" class="btn-outline" style="margin-top: 16px;">+ Add Another Model</button>
                </fieldset>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Create Mattress</button>
                </div>
            </form>
        `;
        
        setupLogoUpload(container);
        attachModelListeners();
        
        document.getElementById('addMattressForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewMattress();
        });
    }
    
    function addNewMattress() {
        const container = document.getElementById('addFormContainer');
        const formData = buildMattressDataFromForm(container);
        const brandName = formData.brandName;
        
        if (!brandName) {
            showStatus('Brand name is required', true);
            return;
        }
        
        if (mattressData[brandName]) {
            showStatus(`Brand "${brandName}" already exists!`, true);
            return;
        }
        
        fetch(spApi.root + 'sleepare/v1/mattresses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': spApi.nonce
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(() => {
            showStatus(`✅ "${brandName}" added successfully!`);
            loadAdminData();
            renderAddForm();
            document.querySelector('.admin-tab[data-tab="edit"]').click();
        })
        .catch(error => {
            console.error('Error adding:', error);
            showStatus('Error adding brand', true);
        });
    }
    
    function populateBrandSelect() {
        const select = document.getElementById('brandSelect');
        if (!select) return;
        
        select.innerHTML = '<option value="">-- Select a mattress brand --</option>';
        Object.keys(mattressData).sort().forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            select.appendChild(option);
        });
    }
    
    function renderBrandsList() {
        const container = document.getElementById('brandsListContainer');
        if (!container) return;
        
        const brands = Object.keys(mattressData).sort();
        if (brands.length === 0) {
            container.innerHTML = '<p style="color: #8e9aab;">No mattresses found. Use the "Add Mattress" tab to create one.</p>';
            return;
        }
        
        container.innerHTML = brands.map(brand => {
            const data = mattressData[brand];
            const modelCount = data.models?.length || 0;
            return `
                <div class="brand-list-item" data-brand="${escapeHtml(brand)}">
                    <div class="brand-list-info">
                        <div class="brand-list-name">${escapeHtml(brand)}</div>
                        <div class="brand-list-models">${modelCount} model(s) • Rating: ${data.rating}/5</div>
                    </div>
                    <div class="brand-list-actions">
                        <button class="btn-outline edit-brand-btn" data-brand="${escapeHtml(brand)}" style="padding: 6px 14px;">✏️ Edit</button>
                        <button class="btn-danger delete-brand-btn" data-brand="${escapeHtml(brand)}" style="padding: 6px 14px;">🗑️ Delete</button>
                    </div>
                </div>
            `;
        }).join('');
        
        document.querySelectorAll('.brand-list-item').forEach(card => {
            const brand = card.getAttribute('data-brand');
            card.addEventListener('click', (e) => {
                if (e.target.closest('.edit-brand-btn') || e.target.closest('.delete-brand-btn')) return;
                renderBrandModal(brand);
            });
        });
        
        document.querySelectorAll('.edit-brand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const brand = btn.getAttribute('data-brand');
                const select = document.getElementById('brandSelect');
                if (select) {
                    select.value = brand;
                    renderEditForm(brand);
                    document.querySelector('.admin-tab[data-tab="edit"]').click();
                    const modal = document.getElementById('brandModal');
                    if (modal) modal.style.display = 'none';
                }
            });
        });
        
        document.querySelectorAll('.delete-brand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const brand = btn.getAttribute('data-brand');
                confirmAction(`Are you sure you want to delete "${brand}"?`, () => {
                    deleteBrand(brand);
                });
            });
        });
    }
    
    function updateJsonPreview() {
        const preview = document.getElementById('jsonPreview');
        if (preview) {
            const exportData = { mattresses: mattressData, topComparisons: topComparisons };
            preview.innerHTML = beautifyJSON(exportData);
        }
    }
    
    function exportData() {
        const exportData = { mattresses: mattressData, topComparisons: topComparisons };
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mattresses_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showStatus('✅ Data exported successfully!');
    }
    
    function importData(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const imported = JSON.parse(e.target.result);
                if (imported.mattresses) {
                    confirmAction('Importing will replace all current data. Continue?', async () => {
                        for (const [brandName, brandData] of Object.entries(imported.mattresses)) {
                            await fetch(spApi.root + 'sleepare/v1/mattresses', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-WP-Nonce': spApi.nonce
                                },
                                body: JSON.stringify({ brandName, data: brandData })
                            });
                        }
                        showStatus('✅ Data imported successfully!');
                        loadAdminData();
                    });
                } else {
                    showStatus('Invalid JSON: missing "mattresses"', true);
                }
            } catch (err) {
                showStatus('Error parsing JSON: ' + err.message, true);
            }
        };
        reader.readAsText(file);
    }
    
    function copyJsonToClipboard() {
        const exportData = { mattresses: mattressData, topComparisons: topComparisons };
        navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
        showStatus('✅ JSON copied to clipboard!');
    }
    
    function initAdmin() {
        loadAdminData();
        
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.admin-panel').forEach(panel => panel.classList.remove('active'));
                document.getElementById(`${tabId}Panel`).classList.add('active');
            });
        });
        
        const brandSelect = document.getElementById('brandSelect');
        if (brandSelect) {
            brandSelect.addEventListener('change', (e) => {
                if (e.target.value) renderEditForm(e.target.value);
                else {
                    const editContainer = document.getElementById('editFormContainer');
                    if (editContainer) {
                        editContainer.style.display = 'none';
                        editContainer.innerHTML = '';
                    }
                }
            });
        }
        
        document.getElementById('exportBtn')?.addEventListener('click', exportData);
        document.getElementById('importBtn')?.addEventListener('click', () => {
            const fileInput = document.getElementById('importFile');
            if (fileInput?.files.length) importData(fileInput.files[0]);
            else showStatus('Please select a JSON file first', true);
        });
        document.getElementById('copyJsonBtn')?.addEventListener('click', copyJsonToClipboard);
        document.getElementById('refreshDataBtn')?.addEventListener('click', () => {
            confirmAction('Refresh will reload from WordPress and discard unsaved changes.', () => loadAdminData());
        });
        
        const modal = document.getElementById('brandModal');
        const closeBtn = modal?.querySelector('.modal-close');
        if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
        
        const modalEditBtn = document.getElementById('modalEditBtn');
        if (modalEditBtn) {
            modalEditBtn.addEventListener('click', () => {
                if (currentModalBrand) {
                    const select = document.getElementById('brandSelect');
                    if (select) {
                        select.value = currentModalBrand;
                        renderEditForm(currentModalBrand);
                        document.querySelector('.admin-tab[data-tab="edit"]').click();
                        modal.style.display = 'none';
                    }
                }
            });
        }
        
        const modalDeleteBtn = document.getElementById('modalDeleteBtn');
        if (modalDeleteBtn) {
            modalDeleteBtn.addEventListener('click', () => {
                if (currentModalBrand) {
                    confirmAction(`Are you sure you want to delete "${currentModalBrand}"?`, () => {
                        deleteBrand(currentModalBrand);
                        modal.style.display = 'none';
                    });
                }
            });
        }
        
        window.addEventListener('click', (e) => {
            if (modal && e.target === modal) modal.style.display = 'none';
        });
    }
    
    document.addEventListener('DOMContentLoaded', initAdmin);
    <?php
    return ob_get_clean();
}

function sp_get_detailed_js() {
    ob_start();
    ?>
    let chartInstance = null;
    let mattressData = {};
    
    function getUrlParameter(name) {
        return new URLSearchParams(window.location.search).get(name);
    }
    
    function renderStars(rating) {
        const fullStars = Math.floor(rating);
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) starsHtml += '★';
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) starsHtml += '☆';
        return `<span style="color: #FFB800;">${starsHtml}</span> <strong>${rating}/5</strong>`;
    }
    
    function firmnessBar(value) {
        const percent = (value / 10) * 100;
        return `<div class="firmness-bar-container"><div class="firmness-fill" style="width: ${percent}%;"></div></div>`;
    }
    
    function renderDetailedComparison(brandA, brandB, modelAIndex = 0, modelBIndex = 0) {
        const dataA = mattressData[brandA];
        const dataB = mattressData[brandB];
        
        if (!dataA || !dataB) {
            document.getElementById('comparisonContent').innerHTML = `
                <div class="error-message">
                    <div class="section-tag purple">Error</div>
                    <h2>Invalid Mattress Selection</h2>
                    <p>One or both mattress brands could not be found.</p>
                    <a href="/comparison-tool/" class="btn-primary" style="margin-top: 24px;">Back to Comparison Tool</a>
                </div>
            `;
            return;
        }
        
        const modelA = dataA.models ? dataA.models[modelAIndex] : {
            name: brandA, type: "Hybrid", firmness: 6, firmnessText: "Medium",
            price: "$1,000 – $2,000", bestFor: "All sleepers", keyFeatures: ["Quality", "Comfort"],
            tagline: "Premium comfort", cooling: "Breathable", motionIsolation: "Good", edgeSupport: "Good"
        };
        
        const modelB = dataB.models ? dataB.models[modelBIndex] : {
            name: brandB, type: "Hybrid", firmness: 6, firmnessText: "Medium",
            price: "$1,000 – $2,000", bestFor: "All sleepers", keyFeatures: ["Quality", "Comfort"],
            tagline: "Premium comfort", cooling: "Breathable", motionIsolation: "Good", edgeSupport: "Good"
        };
        
        const priceA = parseInt(modelA.price.replace(/[^0-9]/g, '')) || 1500;
        const priceB = parseInt(modelB.price.replace(/[^0-9]/g, '')) || 1500;
        
        const html = `
            <div class="comparison-header">
                <div style="display: flex; align-items: center; justify-content: center; gap: 40px; flex-wrap: wrap;">
                    <div style="text-align: center; flex: 1; min-width: 200px;">
                        <img src="${dataA.logo}" alt="${brandA}" style="max-width: 140px; height: auto; max-height: 56px; object-fit: contain; margin-bottom: 12px;" onerror="this.style.display='none'">
                        <h3 style="margin: 8px 0 4px;">${brandA}</h3>
                        <div class="score-badge">${dataA.rating} ★ Overall Rating</div>
                        <div style="margin-top: 8px;">${renderStars(dataA.rating)}</div>
                        <div style="font-size: 13px; color: #5a6874; margin-top: 8px;">${modelA.name}</div>
                    </div>
                    <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #5E00FF 0%, #C800FF 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 20px;">VS</div>
                    <div style="text-align: center; flex: 1; min-width: 200px;">
                        <img src="${dataB.logo}" alt="${brandB}" style="max-width: 140px; height: auto; max-height: 56px; object-fit: contain; margin-bottom: 12px;" onerror="this.style.display='none'">
                        <h3 style="margin: 8px 0 4px;">${brandB}</h3>
                        <div class="score-badge">${dataB.rating} ★ Overall Rating</div>
                        <div style="margin-top: 8px;">${renderStars(dataB.rating)}</div>
                        <div style="font-size: 13px; color: #5a6874; margin-top: 8px;">${modelB.name}</div>
                    </div>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border-radius: 24px; padding: 28px; margin-bottom: 40px; text-align: center; border: 1px solid var(--border-light);">
                <div style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-blue); margin-bottom: 12px;">At a Glance</div>
                <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin-top: 16px;">
                    <div><strong>${brandA}</strong><br>${modelA.type.split('/')[0]} • ${modelA.firmnessText}</div>
                    <div style="font-size: 20px; color: var(--primary);">⚖️</div>
                    <div><strong>${brandB}</strong><br>${modelB.type.split('/')[0]} • ${modelB.firmnessText}</div>
                </div>
            </div>
            
            <div style="background: white; border-radius: 20px; border: 1px solid var(--border-light); overflow: hidden; margin-bottom: 32px;">
                <div style="background: var(--bg-light); padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                    <h3 style="margin: 0;">Feature Comparison</h3>
                </div>
                <table class="spec-table">
                    <thead><tr><th>Category</th><th>${brandA}</th><th>${brandB}</th></tr></thead>
                    <tbody>
                        <tr><td><strong>Overall Rating</strong></td><td>${dataA.rating}/5 ${dataA.rating > dataB.rating ? '★' : (dataA.rating === dataB.rating ? '✓' : '')}</td><td>${dataB.rating}/5 ${dataB.rating > dataA.rating ? '★' : (dataA.rating === dataB.rating ? '✓' : '')}</td></tr>
                        <tr><td><strong>Mattress Type</strong></td><td>${modelA.type}</td><td>${modelB.type}</td></tr>
                        <tr><td><strong>Firmness</strong></td><td>${modelA.firmnessText} (${modelA.firmness}/10) ${firmnessBar(modelA.firmness)}</td><td>${modelB.firmnessText} (${modelB.firmness}/10) ${firmnessBar(modelB.firmness)}</td></tr>
                        <tr><td><strong>Best For</strong></td><td>${modelA.bestFor}</td><td>${modelB.bestFor}</td></tr>
                        <tr><td><strong>Cooling Technology</strong></td><td>${modelA.cooling}</td><td>${modelB.cooling}</td></tr>
                        <tr><td><strong>Motion Isolation</strong></td><td>${modelA.motionIsolation}</td><td>${modelB.motionIsolation}</td></tr>
                        <tr><td><strong>Edge Support</strong></td><td>${modelA.edgeSupport}</td><td>${modelB.edgeSupport}</td></tr>
                        <tr><td><strong>Price (Queen)</strong></td><td>${modelA.price}</td><td>${modelB.price}</td></tr>
                        <tr><td><strong>Trial Period</strong></td><td>${dataA.trial || "100 nights"}</td><td>${dataB.trial || "100 nights"}</td></tr>
                        <tr><td><strong>Warranty</strong></td><td>${dataA.warranty || "10 years"}</td><td>${dataB.warranty || "10 years"}</td></tr>
                    </tbody>
                </table>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                <div class="brand-card">
                    <h4>About ${brandA}</h4>
                    <p style="color: #5a6874; margin: 12px 0;">${modelA.tagline}</p>
                    <div class="feature-list">${modelA.keyFeatures.slice(0, 4).map(f => `<span class="feature-tag">${f}</span>`).join('')}</div>
                    <div style="margin-top: 20px;"><a href="https://www.sleepare.com/shop/" class="btn-primary" style="width: 100%; text-align: center;" target="_blank">Shop ${brandA} →</a></div>
                </div>
                <div class="brand-card">
                    <h4>About ${brandB}</h4>
                    <p style="color: #5a6874; margin: 12px 0;">${modelB.tagline}</p>
                    <div class="feature-list">${modelB.keyFeatures.slice(0, 4).map(f => `<span class="feature-tag">${f}</span>`).join('')}</div>
                    <div style="margin-top: 20px;"><a href="https://www.sleepare.com/shop/" class="btn-primary" style="width: 100%; text-align: center;" target="_blank">Shop ${brandB} →</a></div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                <div class="review-card">
                    <h4>What Customers Say About ${brandA}</h4>
                    <div>${renderStars(dataA.rating)}</div>
                    <div style="margin: 8px 0; font-size: 13px;">Based on ${dataA.customerRatingCount.toLocaleString() || "1,000+"} verified reviews</div>
                    <div class="expert-quote" style="margin-top: 16px;">"${dataA.expertSummary || "Customers consistently praise this mattress for its exceptional comfort and durability."}"</div>
                </div>
                <div class="review-card">
                    <h4>What Customers Say About ${brandB}</h4>
                    <div>${renderStars(dataB.rating)}</div>
                    <div style="margin: 8px 0; font-size: 13px;">Based on ${dataB.customerRatingCount.toLocaleString() || "1,000+"} verified reviews</div>
                    <div class="expert-quote" style="margin-top: 16px;">"${dataB.expertSummary || "Users frequently highlight the excellent support and cooling properties."}"</div>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, var(--bg-light) 0%, white 100%); border-radius: 20px; padding: 32px; margin-bottom: 32px;">
                <h3 style="text-align: center; margin-bottom: 24px;">Which Mattress Is Right For You?</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                    <div>
                        <h4 style="color: var(--primary);">Consider ${brandA} if you:</h4>
                        <ul style="margin-top: 12px; list-style: none; padding: 0;">
                            <li style="padding: 6px 0;">✓ Prefer ${modelA.firmnessText.toLowerCase()} firmness</li>
                            <li style="padding: 6px 0;">✓ Sleep primarily as a ${modelA.bestFor.toLowerCase()}</li>
                            <li style="padding: 6px 0;">✓ ${priceA <= priceB ? 'Want a more budget-friendly option' : 'Are willing to invest in premium features'}</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="color: var(--accent-blue);">Consider ${brandB} if you:</h4>
                        <ul style="margin-top: 12px; list-style: none; padding: 0;">
                            <li style="padding: 6px 0;">✓ Prefer ${modelB.firmnessText.toLowerCase()} firmness</li>
                            <li style="padding: 6px 0;">✓ Sleep primarily as a ${modelB.bestFor.toLowerCase()}</li>
                            <li style="padding: 6px 0;">✓ ${priceB <= priceA ? 'Want a more budget-friendly option' : 'Are willing to invest in premium features'}</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div style="background: var(--heading-color); border-radius: 20px; padding: 40px; text-align: center; margin: 32px 0;">
                <h3 style="color: white; margin-bottom: 16px;">Still Not Sure Which Is Best?</h3>
                <p style="color: rgba(255,255,255,0.8); margin-bottom: 24px; max-width: 600px; margin-left: auto; margin-right: auto;">Visit any SleePare showroom to test both mattresses side-by-side. Our sleep experts will help you find your perfect match based on your unique needs.</p>
                <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                    <a href="https://www.sleepare.com/mattress-stores/" class="btn-primary" style="background: white; color: var(--heading-color);" target="_blank">Find a Showroom Near You</a>
                    <a href="/comparison-tool/" class="btn-outline" style="border-color: white; color: white;">Compare More Mattresses</a>
                </div>
            </div>
        `;
        
        document.getElementById('comparisonContent').innerHTML = html;
    }
    
    function openModal(brand) {
        const modal = document.getElementById('mattressModal');
        const modalContent = document.getElementById('modalContent');
        const data = mattressData[brand];
        const currentModel = data.models?.[0] || {};
        if (!data) return;
        
        modalContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 24px;">
                <img src="${data.logo}" alt="${brand}" style="max-width: 140px; max-height: 48px; object-fit: contain; margin-bottom: 12px;" onerror="this.style.display='none'">
                <div style="font-size: 22px; font-weight: 700; margin-top: 16px;">${currentModel.name || brand}</div>
                <div style="margin-top: 8px;">
                    <span style="font-size: 32px; font-weight: 800; color: var(--primary);">${data.rating}</span><span style="font-size: 16px;">/5</span>
                    <div style="color: #FFB800; margin-top: 4px;">${'★'.repeat(Math.floor(data.rating))}${'☆'.repeat(5 - Math.floor(data.rating))}</div>
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <p style="color: #5a6874; text-align: center; font-style: italic;">${currentModel.tagline}</p>
            </div>
            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <a href="https://www.sleepare.com/shop/" class="btn-primary" style="flex: 1; text-align: center;" target="_blank">Shop ${brand} →</a>
                <a href="https://www.sleepare.com/mattress-stores/" class="btn-outline" style="flex: 1; text-align: center;" target="_blank">Find a Store</a>
            </div>
        `;
        modal.style.display = 'block';
    }
    
    window.openModal = openModal;
    
    function initializeDetailedPage() {
        const compareParam = getUrlParameter('compare');
        if (compareParam && compareParam.includes('|')) {
            const parts = compareParam.split('|');
            const brand1 = parts[0];
            const brand2 = parts[1];
            const model1 = parseInt(parts[2]) || 0;
            const model2 = parseInt(parts[3]) || 0;
            
            if (mattressData[brand1] && mattressData[brand2]) {
                renderDetailedComparison(brand1, brand2, model1, model2);
            } else {
                document.getElementById('comparisonContent').innerHTML = `
                    <div class="error-message">
                        <div class="section-tag purple">Error</div>
                        <h2>Invalid Comparison</h2>
                        <a href="/comparison-tool/" class="btn-primary">Back to Comparison Tool</a>
                    </div>
                `;
            }
        } else {
            document.getElementById('comparisonContent').innerHTML = `
                <div class="error-message">
                    <div class="section-tag purple">Welcome</div>
                    <h2>No Mattresses Selected</h2>
                    <a href="/comparison-tool/" class="btn-primary">Start Comparing</a>
                </div>
            `;
        }
    }
    
    function loadData() {
        fetch(spApi.root + 'sleepare/v1/mattresses', {
            headers: { 'X-WP-Nonce': spApi.nonce }
        })
        .then(response => response.json())
        .then(data => {
            mattressData = data.mattresses;
            initializeDetailedPage();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('comparisonContent').innerHTML = `
                <div class="error-message">
                    <div class="section-tag purple">Error</div>
                    <h2>Failed to load mattress data</h2>
                    <p>Please try again later.</p>
                </div>
            `;
        });
    }
    
    document.addEventListener('DOMContentLoaded', loadData);
    
    const modal = document.getElementById('mattressModal');
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) modal.style.display = 'none';
    });
    <?php
    return ob_get_clean();
}