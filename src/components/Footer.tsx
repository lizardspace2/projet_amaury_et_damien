import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Building, Heart, Shield, Award } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white relative z-20 border-t border-slate-700">
      {/* Main Footer Content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl blur opacity-25"></div>
                <Building className="h-8 w-8 text-teal-400 relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  AnnoncesImmo
                </span>
                <span className="text-sm font-medium text-slate-400 leading-tight">
                  RÉGION LYONNAISE
                </span>
              </div>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Votre partenaire de confiance pour tous vos projets immobiliers dans la région lyonnaise. 
              Achat, vente, location - nous vous accompagnons à chaque étape.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="p-2 bg-slate-700 hover:bg-teal-600 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg"
              >
                <Facebook size={18} className="text-slate-300 hover:text-white" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-slate-700 hover:bg-pink-600 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg"
              >
                <Instagram size={18} className="text-slate-300 hover:text-white" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-slate-700 hover:bg-blue-500 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg"
              >
                <Twitter size={18} className="text-slate-300 hover:text-white" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-slate-700 hover:bg-blue-700 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg"
              >
                <Linkedin size={18} className="text-slate-300 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Navigation
              </span>
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Accueil" },
                { to: "/properties?type=sale", label: "Acheter" },
                { to: "/properties?type=rent", label: "Louer" },
                { to: "/properties?type=lease", label: "Bail Commercial" },
                { to: "/properties?type=rent_by_day", label: "Location Journalière" },
                { to: "/sell", label: "Publier une annonce" }
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-slate-300 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Nos Services
              </span>
            </h3>
            <ul className="space-y-3">
              {[
                { icon: <Award size={16} />, label: "Estimation gratuite" },
                { icon: <Shield size={16} />, label: "Accompagnement personnalisé" },
                { icon: <Heart size={16} />, label: "Conseils sur mesure" },
                { icon: <Building size={16} />, label: "Gestion locative" },
                { icon: <MapPin size={16} />, label: "Expertise de quartier" }
              ].map((service, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-300 group">
                  <div className="text-teal-500 group-hover:scale-110 transition-transform duration-200">
                    {service.icon}
                  </div>
                  <span className="group-hover:text-teal-400 transition-colors duration-200">
                    {service.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Contact
              </span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-teal-600 transition-colors duration-200">
                  <Phone size={16} className="text-teal-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Téléphone</p>
                  <p className="text-white font-medium group-hover:text-teal-400 transition-colors duration-200">
                    +33 4 28 00 00 00
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-teal-600 transition-colors duration-200">
                  <Mail size={16} className="text-teal-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Email</p>
                  <p className="text-white font-medium group-hover:text-teal-400 transition-colors duration-200">
                    contact@annoncesimmo-lyon.fr
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-teal-600 transition-colors duration-200 mt-1">
                  <MapPin size={16} className="text-teal-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Adresse</p>
                  <p className="text-white font-medium group-hover:text-teal-400 transition-colors duration-200 leading-tight">
                    Place Bellecour<br />
                    69002 Lyon, France
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-teal-500" />
                <span>Transactions sécurisées</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-teal-500" />
                <span>Expertise certifiée</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-teal-500" />
                <span>Service client 7j/7</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600">
                <span className="text-slate-300 text-sm">⭐ 4.9/5</span>
              </div>
              <div className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600">
                <span className="text-slate-300 text-sm">🏆 Excellence 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 <span className="text-teal-400 font-semibold">AnnoncesImmo Région Lyonnaise</span>. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              {[
                { to: "/privacy", label: "Confidentialité" },
                { to: "/terms", label: "Conditions" },
                { to: "/sitemap", label: "Plan du site" },
                { to: "/cookies", label: "Cookies" }
              ].map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="text-slate-400 hover:text-teal-400 text-sm transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;