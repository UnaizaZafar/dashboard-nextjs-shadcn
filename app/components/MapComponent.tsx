const MapComponent = () => {
  return (
    <div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.763618416879!2d73.06274657549797!3d33.637370573316076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df954179faa01b%3A0xe85df04eebdef26f!2sBXTrack%20Solutions!5e0!3m2!1sen!2s!4v1762329491733!5m2!1sen!2s"
        width={'auto'}
        height={450}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        className="w-full"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default MapComponent;
