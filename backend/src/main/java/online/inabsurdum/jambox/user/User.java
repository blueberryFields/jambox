package online.inabsurdum.jambox.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(unique = true, length = 50)
    private String username;
    private String password;
    private String bandName;
    @ElementCollection(fetch = FetchType.EAGER)
    List<Role> roles;

    public User(UserDTO userDTO) {
        this.username = userDTO.getUsername();
        this.password = userDTO.getPassword();
        this.roles = userDTO.getRoles();
    }

    public User(ReducedUserDTO userDTO) {
        this.id = userDTO.getId();
        this.username = userDTO.getUsername();
    }
}
