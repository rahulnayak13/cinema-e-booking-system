package com.team17.cinema.dto;

public class PaymentCardDto {
    private Integer id;
    private String cardHolderName;
    private String cardNumber;
    private String expiryDate;
    
    public PaymentCardDto() {}
    
    public PaymentCardDto(Integer id, String cardHolderName, String cardNumber, String expiryDate) {
        this.id = id;
        this.cardHolderName = cardHolderName;
        this.cardNumber = cardNumber;
        this.expiryDate = expiryDate;
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getCardHolderName() { return cardHolderName; }
    public void setCardHolderName(String cardHolderName) { this.cardHolderName = cardHolderName; }
    
    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
    
    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
}
