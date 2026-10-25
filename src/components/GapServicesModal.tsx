import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GAP_VEHICLES, GAP_TOURS, STP_DISTRICTS } from '../data/initialData';
import {
  X,
  Compass,
  Car,
  Package,
  MapPin,
  Calendar,
  Phone,
  CheckCircle2,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Users,
  Settings2,
  Map
} from 'lucide-react';

interface GapServicesModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialTab?: 'turismo' | 'resolve';
  isEmbedded?: boolean;
}

export const GapServicesModal: React.FC<GapServicesModalProps> = ({
  isOpen = false,
  onClose,
  initialTab = 'turismo',
  isEmbedded = false
}) => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'turismo' | 'resolve'>(initialTab);
  const [turismoSubTab, setTurismoSubTab] = useState<'viaturas' | 'tours'>('viaturas');

  // Car Rental Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(GAP_VEHICLES[0].id);
  const [pickupDate, setPickupDate] = useState('2026-11-01');
  const [returnDate, setReturnDate] = useState('2026-11-05');
  const [pickupLocation, setPickupLocation] = useState('Aeroporto Internacional de São Tomé (TMS)');
  const [carBookingSuccess, setCarBookingSuccess] = useState(false);

  // Tour Booking State
  const [selectedTourId, setSelectedTourId] = useState<string>(GAP_TOURS[0].id);
  const [tourBookingSuccess, setTourBookingSuccess] = useState(false);

  // GAP Resolve State
  const [deliveryType, setDeliveryType] = useState('Encomenda / Documento');
  const [pickupAddress, setPickupAddress] = useState('Água Grande - Centro da Cidade');
  const [dropoffAddress, setDropoffAddress] = useState('Mé-Zóchi - Trindade');
  const [recipientContact, setRecipientContact] = useState('+239 9900000');
  const [deliverySuccess, setDeliverySuccess] = useState(false);

  // Geolocation State for São Tomé e Príncipe
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  if (!isOpen && !isEmbedded) return null;

  const handleGetMyLocation = () => {
    setGeoLoading(true);
    setGeoError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setGeoLoading(false);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Coordenadas GPS Detectadas (São Tomé e Príncipe)'
          });
          setPickupAddress(`Localização Atual (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`);
        },
        _err => {
          // Fallback to central São Tomé coordinates for convenience
          setGeoLoading(false);
          setUserLocation({
            lat: 0.3365,
            lng: 6.7273,
            name: 'São Tomé Centro (Água Grande)'
          });
          setPickupAddress('São Tomé Centro (Água Grande, Praça da Independência)');
        },
        { timeout: 5000 }
      );
    } else {
      setGeoLoading(false);
      setGeoError('Geolocalização não suportada no navegador.');
    }
  };

  const handleCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCarBookingSuccess(true);
    setTimeout(() => {
      setCarBookingSuccess(false);
      if (onClose) onClose();
    }, 2500);
  };

  const handleTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTourBookingSuccess(true);
    setTimeout(() => {
      setTourBookingSuccess(false);
      if (onClose) onClose();
    }, 2500);
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeliverySuccess(true);
    setTimeout(() => {
      setDeliverySuccess(false);
      if (onClose) onClose();
    }, 2500);
  };

  const contentJSX = (
    <div className={`relative w-full ${isEmbedded ? '' : 'max-w-4xl h-[92vh] max-h-[850px]'} flex flex-col bg-stone-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-stone-100`}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-stone-800 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Serviços do Grupo GAP</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                São Tomé e Príncipe 🇸🇹
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              Turismo, aluguer de viaturas 4x4 e serviços de estafetas / delivery com mapa integrado
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

        {/* Top Service Switcher: GAP Serviços & Turismo vs GAP Resolve */}
        <div className="flex border-b border-stone-800 bg-stone-950 px-3 sm:px-6 overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setActiveTab('turismo')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'turismo'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>GAP Serviços & Turismo (Viaturas & Tours)</span>
          </button>

          <button
            onClick={() => setActiveTab('resolve')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'resolve'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>GAP Resolve (Entregas & Mapa STP)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* ================= SECTION 1: GAP SERVIÇOS & TURISMO ================= */}
          {activeTab === 'turismo' && (
            <div className="space-y-4">
              {/* Sub-tabs: Viaturas vs Tours */}
              <div className="flex bg-stone-950 border border-stone-800 rounded-xl p-1 text-xs max-w-sm">
                <button
                  onClick={() => setTurismoSubTab('viaturas')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    turismoSubTab === 'viaturas'
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Aluguer de Viaturas 4x4
                </button>
                <button
                  onClick={() => setTurismoSubTab('tours')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    turismoSubTab === 'tours'
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Serviços Turísticos
                </button>
              </div>

              {/* VIATURAS */}
              {turismoSubTab === 'viaturas' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {GAP_VEHICLES.map(vehicle => (
                      <div
                        key={vehicle.id}
                        onClick={() => setSelectedVehicleId(vehicle.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedVehicleId === vehicle.id
                            ? 'bg-amber-500/15 border-amber-400 shadow-md'
                            : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <img
                            src={vehicle.imageUrl}
                            alt=""
                            className="w-full h-32 object-cover rounded-xl"
                          />
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-white">{vehicle.name}</h4>
                            <span className="text-[10px] bg-stone-800 text-amber-400 font-bold px-2 py-0.5 rounded">
                              {vehicle.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 leading-snug">{vehicle.popularFor}</p>

                          <div className="flex items-center gap-3 text-[10px] text-stone-300">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-amber-400" />
                              {vehicle.passengers} lugares
                            </span>
                            <span className="flex items-center gap-1">
                              <Fuel className="w-3 h-3 text-amber-400" />
                              {vehicle.fuel}
                            </span>
                            <span className="flex items-center gap-1">
                              <Settings2 className="w-3 h-3 text-amber-400" />
                              {vehicle.transmission}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-stone-800/80 mt-3 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-black text-amber-400">
                              {vehicle.dailyPriceDobras} STN
                            </span>
                            <span className="text-[10px] text-stone-400 block">
                              /dia (~{vehicle.dailyPriceEuros} €)
                            </span>
                          </div>
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                              selectedVehicleId === vehicle.id
                                ? 'bg-amber-500 text-stone-950'
                                : 'bg-stone-800 text-stone-300'
                            }`}
                          >
                            {selectedVehicleId === vehicle.id ? 'Selecionado' : 'Escolher'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Booking Form */}
                  <form
                    onSubmit={handleCarSubmit}
                    className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3"
                  >
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>Formulário de Reserva • GAP Viaturas</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Data de Levantamento</label>
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={e => setPickupDate(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Data de Devolução</label>
                        <input
                          type="date"
                          value={returnDate}
                          onChange={e => setReturnDate(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Local de Entrega em STP</label>
                        <select
                          value={pickupLocation}
                          onChange={e => setPickupLocation(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                        >
                          <option value="Aeroporto Internacional de São Tomé (TMS)">Aeroporto de São Tomé (TMS)</option>
                          <option value="Cidade de São Tomé (Hotel / Alojamento)">Cidade de São Tomé (Hotel / Alojamento)</option>
                          <option value="Santana / Cantagalo">Santana / Cantagalo</option>
                          <option value="Porto Alegre / Sul">Porto Alegre / Sul</option>
                        </select>
                      </div>
                    </div>

                    {carBookingSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Reserva efetuada com sucesso! A equipa da GAP Turismo entrará em contacto via WhatsApp / Telemóvel.</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Confirmar Reserva de Viatura</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* TOURS */}
              {turismoSubTab === 'tours' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {GAP_TOURS.map(tour => (
                      <div
                        key={tour.id}
                        onClick={() => setSelectedTourId(tour.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedTourId === tour.id
                            ? 'bg-amber-500/15 border-amber-400 shadow-md'
                            : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <img src={tour.imageUrl} alt="" className="w-full h-32 object-cover rounded-xl" />
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-amber-400 font-bold">{tour.region}</span>
                            <span className="text-[10px] text-stone-400 font-mono">{tour.duration}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white">{tour.title}</h4>

                          <ul className="text-[10px] text-stone-300 space-y-0.5">
                            {tour.highlights.slice(0, 3).map((h, i) => (
                              <li key={i}>• {h}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 border-t border-stone-800/80 mt-3 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-black text-amber-400">{tour.priceDobras} STN</span>
                            <span className="text-[10px] text-stone-400 block">/pessoa (~{tour.priceEuros} €)</span>
                          </div>
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                              selectedTourId === tour.id
                                ? 'bg-amber-500 text-stone-950'
                                : 'bg-stone-800 text-stone-300'
                            }`}
                          >
                            {selectedTourId === tour.id ? 'Selecionado' : 'Reservar'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tour Booking Form */}
                  <form
                    onSubmit={handleTourSubmit}
                    className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3"
                  >
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-amber-400" />
                      <span>Formulário de Excursão Turística Guiada</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Data Pretendida</label>
                        <input
                          type="date"
                          defaultValue="2026-11-02"
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Número de Participantes</label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          defaultValue={2}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                          required
                        />
                      </div>
                    </div>

                    {tourBookingSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Roteiro reservado! Um guia santomense da GAP Turismo entrará em contacto.</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Solicitar Guia & Roteiro Turístico</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ================= SECTION 2: GAP RESOLVE (DELIVERY & MAPA STP) ================= */}
          {activeTab === 'resolve' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Interactive Map of São Tomé e Príncipe */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold text-white">Mapa de São Tomé e Príncipe</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleGetMyLocation}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold flex items-center gap-1 transition-all"
                      >
                        <Navigation className={`w-3 h-3 ${geoLoading ? 'animate-spin' : ''}`} />
                        <span>Minha Localização</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Clique nos pontos-chave da ilha para definir o ponto de entrega rápida ou use o botão de GPS acima.
                    </p>
                  </div>

                  {/* Stylized Interactive Island Map SVG */}
                  <div className="relative w-full aspect-square max-h-72 bg-gradient-to-b from-sky-950/40 via-stone-900 to-stone-950 rounded-xl border border-stone-800 flex items-center justify-center overflow-hidden p-2">
                    {/* SVG map contours of São Tomé & Príncipe */}
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                      {/* Ocean Background subtle grid */}
                      <circle cx="200" cy="200" r="180" fill="none" stroke="#292524" strokeDasharray="4 4" />

                      {/* Ilha do Príncipe (Northeast) */}
                      <g className="cursor-pointer group" onClick={() => setDropoffAddress('Santo António (Ilha do Príncipe)')}>
                        <path
                          d="M 280 60 C 295 50, 320 65, 310 85 C 300 95, 275 90, 280 60 Z"
                          fill="#44403c"
                          stroke="#eab308"
                          strokeWidth="1.5"
                          className="hover:fill-amber-900/60 transition-colors"
                        />
                        <text x="270" y="45" fill="#fde047" fontSize="10" fontWeight="bold">Ilha do Príncipe</text>
                        <circle cx="295" cy="72" r="3" fill="#ef4444" />
                      </g>

                      {/* Ilha de São Tomé (Central & South) */}
                      <g className="cursor-pointer group">
                        <path
                          d="M 180 130 C 220 125, 240 160, 230 200 C 225 240, 210 270, 190 300 C 170 330, 150 320, 140 280 C 130 240, 140 170, 180 130 Z"
                          fill="#292524"
                          stroke="#ca8a04"
                          strokeWidth="2"
                          className="hover:fill-stone-800 transition-colors"
                        />

                        {/* Interactive District Pins */}
                        {/* 1. Cidade de São Tomé (Água Grande) */}
                        <g onClick={() => setDropoffAddress('Água Grande (Cidade de São Tomé)')} className="cursor-pointer">
                          <circle cx="215" cy="165" r="5" fill="#f59e0b" className="animate-pulse" />
                          <text x="225" y="168" fill="#fff" fontSize="9" fontWeight="bold">São Tomé (Centro)</text>
                        </g>

                        {/* 2. Trindade (Mé-Zóchi) */}
                        <g onClick={() => setDropoffAddress('Mé-Zóchi (Trindade / Monte Café)')} className="cursor-pointer">
                          <circle cx="185" cy="180" r="4" fill="#38bdf8" />
                          <text x="120" y="183" fill="#94a3b8" fontSize="8">Trindade</text>
                        </g>

                        {/* 3. Santana (Cantagalo) */}
                        <g onClick={() => setDropoffAddress('Cantagalo (Santana)')} className="cursor-pointer">
                          <circle cx="215" cy="205" r="4" fill="#10b981" />
                          <text x="225" y="208" fill="#94a3b8" fontSize="8">Santana</text>
                        </g>

                        {/* 4. São João dos Angolares (Caué) */}
                        <g onClick={() => setDropoffAddress('Caué (São João dos Angolares)')} className="cursor-pointer">
                          <circle cx="195" cy="255" r="4" fill="#f97316" />
                          <text x="135" y="258" fill="#94a3b8" fontSize="8">Angolares</text>
                        </g>

                        {/* 5. Neves (Lembá) */}
                        <g onClick={() => setDropoffAddress('Lembá (Neves)')} className="cursor-pointer">
                          <circle cx="155" cy="155" r="4" fill="#a855f7" />
                          <text x="110" y="152" fill="#94a3b8" fontSize="8">Neves</text>
                        </g>

                        {/* 6. Ilhéu das Rolas / Porto Alegre (Sul) */}
                        <g onClick={() => setDropoffAddress('Porto Alegre / Ilhéu das Rolas')} className="cursor-pointer">
                          <circle cx="165" cy="335" r="4" fill="#eab308" />
                          <text x="175" y="340" fill="#fde047" fontSize="8" fontWeight="bold">Ilhéu das Rolas</text>
                        </g>
                      </g>

                      {/* User Location GPS Ping */}
                      {userLocation && (
                        <g>
                          <circle cx="215" cy="165" r="10" fill="none" stroke="#22c55e" strokeWidth="2" className="animate-ping" />
                          <circle cx="215" cy="165" r="4" fill="#22c55e" />
                        </g>
                      )}
                    </svg>

                    {userLocation && (
                      <div className="absolute bottom-2 left-2 right-2 bg-stone-900/90 backdrop-blur-md p-2 rounded-lg border border-emerald-500/40 text-[10px] text-emerald-300 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {userLocation.name}
                        </span>
                        <span className="font-mono">Lat: {userLocation.lat.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: GAP Resolve Delivery Order Form */}
                <form
                  onSubmit={handleDeliverySubmit}
                  className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-white">Solicitar Entrega Rápida • GAP Resolve</h4>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Tipo de Encomenda / Serviço</label>
                      <select
                        value={deliveryType}
                        onChange={e => setDeliveryType(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      >
                        <option value="Documentos Urgentes">Documentos Urgentes / Cartórios</option>
                        <option value="Compras no Mercado Grande">Compras no Mercado Grande de São Tomé</option>
                        <option value="Produtos & Artesanato">Produtos Artísticos & Encomendas de Talents</option>
                        <option value="Refeições & Gastronomia">Refeições & Pratos Crioulos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Local de Recolha</label>
                      <input
                        type="text"
                        value={pickupAddress}
                        onChange={e => setPickupAddress(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Destino de Entrega (Clique no Mapa ou selecione)</label>
                      <input
                        type="text"
                        value={dropoffAddress}
                        onChange={e => setDropoffAddress(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Telemóvel do Destinatário (+239)</label>
                      <input
                        type="tel"
                        value={recipientContact}
                        onChange={e => setRecipientContact(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                      <span className="text-stone-300">Estimativa de Tarifa Local:</span>
                      <span className="font-mono font-bold text-amber-400">40 a 70 STN</span>
                    </div>
                  </div>

                  {deliverySuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pedido de entrega aceite! O estafeta da GAP Resolve foi notificado.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Chamar Estafeta GAP Resolve</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
  );

  if (isEmbedded) {
    return contentJSX;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      {contentJSX}
    </div>
  );
};
